package com.mycompany.reservation.service;

import com.mycompany.reservation.domain.Reservation;
import com.mycompany.reservation.domain.enumeration.ReservationStatus;
import com.mycompany.reservation.repository.CustomerRepository;
import com.mycompany.reservation.repository.ReservationRepository;
import com.mycompany.reservation.repository.UserRepository;
import com.mycompany.reservation.security.AuthoritiesConstants;
import com.mycompany.reservation.security.SecurityUtils;
import com.mycompany.reservation.service.dto.CustomerReservationSummaryDTO;
import com.mycompany.reservation.service.dto.ReservationDTO;
import com.mycompany.reservation.service.dto.ReservationFilterCriteria;
import com.mycompany.reservation.service.dto.ReservationReportDTO;
import com.mycompany.reservation.service.mapper.ReservationMapper;
import jakarta.persistence.EntityNotFoundException;
import java.time.ZonedDateTime;
import java.util.EnumSet;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.reservation.domain.Reservation}.
 */
@Service
@Transactional
public class ReservationService {

    public static final String CUSTOMER_RESERVATION_SUMMARY_CACHE = "customerReservationSummary";

    private static final EnumSet<ReservationStatus> UPCOMING_STATUSES = EnumSet.of(ReservationStatus.PENDING, ReservationStatus.CONFIRMED);

    private static final Logger LOG = LoggerFactory.getLogger(ReservationService.class);

    private final ReservationRepository reservationRepository;

    private final ReservationMapper reservationMapper;

    private final CustomerRepository customerRepository;

    private final UserRepository userRepository;

    public ReservationService(
        ReservationRepository reservationRepository,
        ReservationMapper reservationMapper,
        CustomerRepository customerRepository,
        UserRepository userRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.reservationMapper = reservationMapper;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    /**
     * Save a reservation.
     *
     * @param reservationDTO the entity to save.
     * @return the persisted entity.
     */
    @CacheEvict(cacheNames = CUSTOMER_RESERVATION_SUMMARY_CACHE, allEntries = true)
    public ReservationDTO save(ReservationDTO reservationDTO) {
        LOG.debug("Request to save Reservation : {}", reservationDTO);
        applyOwner(reservationDTO, true);
        Reservation reservation = reservationMapper.toEntity(reservationDTO);
        reservation = reservationRepository.save(reservation);
        return reservationMapper.toDto(reservation);
    }

    /**
     * Update a reservation.
     *
     * @param reservationDTO the entity to save.
     * @return the persisted entity.
     */
    @CacheEvict(cacheNames = CUSTOMER_RESERVATION_SUMMARY_CACHE, allEntries = true)
    public ReservationDTO update(ReservationDTO reservationDTO) {
        LOG.debug("Request to update Reservation : {}", reservationDTO);
        Reservation existingReservation = reservationRepository
            .findById(reservationDTO.getId())
            .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));
        assertCanAccessReservation(existingReservation);
        applyOwner(reservationDTO, reservationDTO.getUserId() != null);
        Reservation reservation = reservationMapper.toEntity(reservationDTO);
        reservation = reservationRepository.save(reservation);
        return reservationMapper.toDto(reservation);
    }

    @CacheEvict(cacheNames = CUSTOMER_RESERVATION_SUMMARY_CACHE, allEntries = true)
    public ReservationDTO approve(Long reservationId, String notes) {
        LOG.debug("Request to approve Reservation : {}", reservationId);
        Reservation reservation = reservationRepository
            .findById(reservationId)
            .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));
        assertCanAccessReservation(reservation);
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Sadece bekleyen rezervasyonlar onaylanabilir");
        }
        reservation.setStatus(ReservationStatus.CONFIRMED);
        if (notes != null) {
            reservation.setNotes(notes.isBlank() ? null : notes);
        }
        reservation = reservationRepository.save(reservation);
        return reservationMapper.toDto(reservation);
    }

    /**
     * Partially update a reservation.
     *
     * @param reservationDTO the entity to update partially.
     * @return the persisted entity.
     */
    @CacheEvict(cacheNames = CUSTOMER_RESERVATION_SUMMARY_CACHE, allEntries = true)
    public Optional<ReservationDTO> partialUpdate(ReservationDTO reservationDTO) {
        LOG.debug("Request to partially update Reservation : {}", reservationDTO);

        return reservationRepository
            .findById(reservationDTO.getId())
            .map(existingReservation -> {
                assertCanAccessReservation(existingReservation);
                if (reservationDTO.getUserId() != null) {
                    applyOwner(reservationDTO, true);
                }
                reservationMapper.partialUpdate(existingReservation, reservationDTO);

                return existingReservation;
            })
            .map(reservationRepository::save)
            .map(reservationMapper::toDto);
    }

    /**
     * Get all the reservations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ReservationDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Reservations");
        return reservationRepository.findAll(pageable).map(reservationMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ReservationDTO> findByCustomer(Long customerId, ReservationFilterCriteria criteria, Pageable pageable) {
        LOG.debug("Request to get Reservations for customer {} with filter {}", customerId, criteria);
        ReservationFilterCriteria filters = criteria != null ? criteria : new ReservationFilterCriteria();
        filters.setCustomerId(customerId);
        Specification<Reservation> specification = buildSpecification(filters);
        return reservationRepository.findAll(specification, pageable).map(reservationMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ReservationDTO> findForCurrentUser(ReservationFilterCriteria criteria, Pageable pageable) {
        Long currentUserId = getCurrentUserIdFromContext().orElseThrow(() -> new AccessDeniedException("Aktif kullanıcı bulunamadı"));
        LOG.debug("Request to get reservations for current user {} with filter {}", currentUserId, criteria);
        Specification<Reservation> specification = Specification.where(ReservationSpecifications.belongsToUser(currentUserId)).and(
            buildSpecification(criteria)
        );
        return reservationRepository.findAll(specification, pageable).map(reservationMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ReservationDTO> findUpcoming(int size) {
        ZonedDateTime now = ZonedDateTime.now();
        Specification<Reservation> specification = Specification.where(ReservationSpecifications.startsAfter(now)).and(
            ReservationSpecifications.hasStatusIn(UPCOMING_STATUSES)
        );
        PageRequest pageRequest = PageRequest.of(0, Math.max(size, 1), Sort.by(Sort.Direction.ASC, "date"));
        return reservationRepository.findAll(specification, pageRequest).map(reservationMapper::toDto);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = CUSTOMER_RESERVATION_SUMMARY_CACHE, key = "#customerId")
    public CustomerReservationSummaryDTO getCustomerSummary(Long customerId) {
        LOG.debug("Request reservation summary for customer {}", customerId);
        CustomerReservationSummaryDTO summary = new CustomerReservationSummaryDTO();
        summary.setCustomerId(customerId);
        customerRepository
            .findById(customerId)
            .ifPresent(customer -> summary.setCustomerFullName(customer.getFirstName() + " " + customer.getLastName()));

        ZonedDateTime now = ZonedDateTime.now();
        summary.setTotalReservations(reservationRepository.countByCustomerId(customerId));
        summary.setUpcomingReservations(reservationRepository.countByCustomerIdAndDateAfter(customerId, now));

        reservationRepository
            .findFirstByCustomerIdOrderByDateDesc(customerId)
            .map(Reservation::getDate)
            .ifPresent(summary::setLastReservationDate);

        reservationRepository
            .findFirstByCustomerIdAndDateAfterOrderByDateAsc(customerId, now)
            .map(Reservation::getDate)
            .ifPresent(summary::setNextReservationDate);

        Map<ReservationStatus, Consumer<Long>> statusConsumers = Map.of(
            ReservationStatus.PENDING,
            summary::setPendingReservations,
            ReservationStatus.CONFIRMED,
            summary::setConfirmedReservations,
            ReservationStatus.CANCELLED,
            summary::setCancelledReservations,
            ReservationStatus.COMPLETED,
            summary::setCompletedReservations
        );

        reservationRepository
            .countByCustomerGroupedByStatus(customerId)
            .forEach(statusCount -> statusConsumers.getOrDefault(statusCount.getStatus(), unused -> {}).accept(statusCount.getTotal()));

        return summary;
    }

    @Transactional(readOnly = true)
    public ReservationReportDTO getReservationReport(ReservationFilterCriteria criteria) {
        ReservationFilterCriteria filters = criteria != null ? criteria : new ReservationFilterCriteria();
        Specification<Reservation> specification = buildSpecification(filters);
        ReservationReportDTO report = new ReservationReportDTO();
        report.setRangeStart(filters.getStartDate());
        report.setRangeEnd(filters.getEndDate());

        report.setTotalReservations(reservationRepository.count(specification));

        ZonedDateTime now = ZonedDateTime.now();
        Specification<Reservation> upcomingSpecification = specification
            .and(ReservationSpecifications.startsAfter(now))
            .and(ReservationSpecifications.hasStatusIn(UPCOMING_STATUSES));
        report.setUpcomingReservations(reservationRepository.count(upcomingSpecification));

        report.setDistinctCustomers(
            reservationRepository.countDistinctCustomersByFilters(filters.getBusinessId(), filters.getStartDate(), filters.getEndDate())
        );
        report.setDistinctBusinesses(
            reservationRepository.countDistinctBusinessesByFilters(filters.getCustomerId(), filters.getStartDate(), filters.getEndDate())
        );

        report.getStatusCounts().clear();
        reservationRepository
            .countByFilters(
                filters.getCustomerId(),
                filters.getBusinessId(),
                filters.getStatus(),
                filters.getStartDate(),
                filters.getEndDate()
            )
            .forEach(statusCount -> report.getStatusCounts().put(statusCount.getStatus(), statusCount.getTotal()));

        return report;
    }

    /**
     * Get one reservation by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ReservationDTO> findOne(Long id) {
        LOG.debug("Request to get Reservation : {}", id);
        return reservationRepository
            .findById(id)
            .map(reservation -> {
                assertCanAccessReservation(reservation);
                return reservation;
            })
            .map(reservationMapper::toDto);
    }

    /**
     * Delete the reservation by id.
     *
     * @param id the id of the entity.
     */
    @CacheEvict(cacheNames = CUSTOMER_RESERVATION_SUMMARY_CACHE, allEntries = true)
    public void delete(Long id) {
        LOG.debug("Request to delete Reservation : {}", id);
        Reservation reservation = reservationRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));
        assertCanAccessReservation(reservation);
        reservationRepository.delete(reservation);
    }

    private Specification<Reservation> buildSpecification(ReservationFilterCriteria criteria) {
        ReservationFilterCriteria filters = criteria != null ? criteria : new ReservationFilterCriteria();
        Specification<Reservation> specification = Specification.where(null);
        specification = specification.and(ReservationSpecifications.belongsToCustomer(filters.getCustomerId()));
        specification = specification.and(ReservationSpecifications.belongsToBusiness(filters.getBusinessId()));
        specification = specification.and(ReservationSpecifications.hasStatus(filters.getStatus()));
        specification = specification.and(ReservationSpecifications.startsAfter(filters.getStartDate()));
        specification = specification.and(ReservationSpecifications.endsBefore(filters.getEndDate()));
        return specification;
    }

    private void applyOwner(ReservationDTO reservationDTO, boolean assignCurrentWhenMissing) {
        Long requestedUserId = reservationDTO.getUserId();
        if (requestedUserId == null && !assignCurrentWhenMissing) {
            return;
        }
        Long resolvedOwnerId = determineOwnerId(requestedUserId);
        if (resolvedOwnerId != null) {
            reservationDTO.setUserId(resolvedOwnerId);
            userRepository.findById(resolvedOwnerId).ifPresent(user -> reservationDTO.setUserLogin(user.getLogin()));
        }
    }

    private Long determineOwnerId(Long requestedUserId) {
        boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN);
        Optional<Long> currentUserIdOptional = getCurrentUserIdFromContext();
        Long currentUserId = currentUserIdOptional.orElse(null);

        if (requestedUserId == null) {
            return currentUserId;
        }

        if (isAdmin) {
            return requestedUserId;
        }

        if (currentUserId != null && currentUserId.equals(requestedUserId)) {
            return currentUserId;
        }

        throw new AccessDeniedException("Rezervasyonlar yalnızca kendi hesabınıza atanabilir");
    }

    private Optional<Long> getCurrentUserIdFromContext() {
        Optional<Long> userId = SecurityUtils.getCurrentUserId();
        if (userId.isPresent()) {
            return userId;
        }
        return SecurityUtils.getCurrentUserLogin().flatMap(login -> userRepository.findOneByLogin(login).map(user -> user.getId()));
    }

    private void assertCanAccessReservation(Reservation reservation) {
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            return;
        }
        Optional<Long> currentUserId = getCurrentUserIdFromContext();
        Long ownerId = reservation.getUser() != null ? reservation.getUser().getId() : null;
        if (ownerId == null || currentUserId.isEmpty() || !ownerId.equals(currentUserId.get())) {
            throw new AccessDeniedException("Rezervasyona erişim izniniz bulunmuyor");
        }
    }
}
