package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.*; // for static metamodels
import com.mycompany.myapp.domain.AppointmentType;
import com.mycompany.myapp.repository.AppointmentTypeRepository;
import com.mycompany.myapp.service.criteria.AppointmentTypeCriteria;
import com.mycompany.myapp.service.dto.AppointmentTypeDTO;
import com.mycompany.myapp.service.mapper.AppointmentTypeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link AppointmentType} entities in the database.
 * The main input is a {@link AppointmentTypeCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link AppointmentTypeDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class AppointmentTypeQueryService extends QueryService<AppointmentType> {

    private static final Logger LOG = LoggerFactory.getLogger(AppointmentTypeQueryService.class);

    private final AppointmentTypeRepository appointmentTypeRepository;

    private final AppointmentTypeMapper appointmentTypeMapper;

    public AppointmentTypeQueryService(AppointmentTypeRepository appointmentTypeRepository, AppointmentTypeMapper appointmentTypeMapper) {
        this.appointmentTypeRepository = appointmentTypeRepository;
        this.appointmentTypeMapper = appointmentTypeMapper;
    }

    /**
     * Return a {@link Page} of {@link AppointmentTypeDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<AppointmentTypeDTO> findByCriteria(AppointmentTypeCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<AppointmentType> specification = createSpecification(criteria);
        return appointmentTypeRepository.findAll(specification, page).map(appointmentTypeMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(AppointmentTypeCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<AppointmentType> specification = createSpecification(criteria);
        return appointmentTypeRepository.count(specification);
    }

    /**
     * Function to convert {@link AppointmentTypeCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<AppointmentType> createSpecification(AppointmentTypeCriteria criteria) {
        Specification<AppointmentType> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildRangeSpecification(criteria.getId(), AppointmentType_.id),
                buildStringSpecification(criteria.getName(), AppointmentType_.name),
                buildStringSpecification(criteria.getDescription(), AppointmentType_.description),
                buildStringSpecification(criteria.getColor(), AppointmentType_.color),
                buildSpecification(criteria.getIsActive(), AppointmentType_.isActive)
            );
        }
        return specification;
    }
}
