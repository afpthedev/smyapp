package com.mycompany.reservation.service;

import com.mycompany.reservation.domain.Business;
import com.mycompany.reservation.domain.Customer;
import com.mycompany.reservation.domain.OfferedService;
import com.mycompany.reservation.domain.Reservation;
import com.mycompany.reservation.domain.enumeration.ReservationStatus;
import com.mycompany.reservation.repository.BusinessRepository;
import com.mycompany.reservation.repository.CustomerRepository;
import com.mycompany.reservation.repository.OfferedServiceRepository;
import com.mycompany.reservation.repository.ReservationRepository;
import com.mycompany.reservation.service.dto.GuestReservationRequest;
import com.mycompany.reservation.service.dto.ReservationDTO;
import com.mycompany.reservation.service.mapper.ReservationMapper;
import com.mycompany.reservation.web.rest.errors.BadRequestAlertException;
import java.util.Locale;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles reservation submissions that originate from public (non authenticated) channels.
 */
@Service
@Transactional
public class GuestReservationService {

    private static final Logger LOG = LoggerFactory.getLogger(GuestReservationService.class);
    private static final String ENTITY_NAME = "reservation";

    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;
    private final CustomerRepository customerRepository;
    private final OfferedServiceRepository offeredServiceRepository;
    private final BusinessRepository businessRepository;

    public GuestReservationService(
        ReservationRepository reservationRepository,
        ReservationMapper reservationMapper,
        CustomerRepository customerRepository,
        OfferedServiceRepository offeredServiceRepository,
        BusinessRepository businessRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.reservationMapper = reservationMapper;
        this.customerRepository = customerRepository;
        this.offeredServiceRepository = offeredServiceRepository;
        this.businessRepository = businessRepository;
    }

    public ReservationDTO createReservation(GuestReservationRequest request) {
        LOG.debug("Public reservation submission received: {}", request.getEmail());

        Customer customer = findOrCreateCustomer(request);
        OfferedService offeredService = resolveOfferedService(request);
        Business business = resolveBusiness(request);

        Reservation reservation = new Reservation()
            .date(request.getReservationDate())
            .status(ReservationStatus.PENDING)
            .notes(request.getNotes());

        reservation.setCustomer(customer);
        reservation.setService(offeredService);
        reservation.setBusiness(business);

        Reservation persisted = reservationRepository.save(reservation);
        LOG.info("Reservation {} stored for guest {}", persisted.getId(), customer.getEmail());
        return reservationMapper.toDto(persisted);
    }

    private Customer findOrCreateCustomer(GuestReservationRequest request) {
        Optional<Customer> existing = customerRepository.findOneByEmailIgnoreCase(request.getEmail());
        Customer customer = existing.orElseGet(Customer::new);
        customer.setEmail(request.getEmail().toLowerCase(Locale.ROOT));
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhone(request.getPhone());
        customer.setNotes(request.getNotes());
        return customerRepository.save(customer);
    }

    private OfferedService resolveOfferedService(GuestReservationRequest request) {
        if (request.getOfferedServiceId() == null) {
            return null;
        }
        return offeredServiceRepository
            .findById(request.getOfferedServiceId())
            .orElseThrow(() -> new BadRequestAlertException("Geçersiz hizmet seçimi", ENTITY_NAME, "serviceNotFound"));
    }

    private Business resolveBusiness(GuestReservationRequest request) {
        if (request.getBusinessId() == null) {
            return null;
        }
        return businessRepository
            .findById(request.getBusinessId())
            .orElseThrow(() -> new BadRequestAlertException("Geçersiz işletme seçimi", ENTITY_NAME, "businessNotFound"));
    }
}
