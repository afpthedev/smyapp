package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Appointment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Appointment entity.
 *
 * When extending this class, extend AppointmentRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface AppointmentRepository
    extends AppointmentRepositoryWithBagRelationships, JpaRepository<Appointment, Long>, JpaSpecificationExecutor<Appointment> {
    @Query("select appointment from Appointment appointment where appointment.createdBy.login = ?#{authentication.name}")
    List<Appointment> findByCreatedByIsCurrentUser();

    default Optional<Appointment> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Appointment> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Appointment> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select appointment from Appointment appointment left join fetch appointment.createdBy left join fetch appointment.type",
        countQuery = "select count(appointment) from Appointment appointment"
    )
    Page<Appointment> findAllWithToOneRelationships(Pageable pageable);

    @Query("select appointment from Appointment appointment left join fetch appointment.createdBy left join fetch appointment.type")
    List<Appointment> findAllWithToOneRelationships();

    @Query(
        "select appointment from Appointment appointment left join fetch appointment.createdBy left join fetch appointment.type where appointment.id =:id"
    )
    Optional<Appointment> findOneWithToOneRelationships(@Param("id") Long id);
}
