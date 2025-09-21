package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Appointment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class AppointmentRepositoryWithBagRelationshipsImpl implements AppointmentRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String APPOINTMENTS_PARAMETER = "appointments";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Appointment> fetchBagRelationships(Optional<Appointment> appointment) {
        return appointment.map(this::fetchParticipants);
    }

    @Override
    public Page<Appointment> fetchBagRelationships(Page<Appointment> appointments) {
        return new PageImpl<>(
            fetchBagRelationships(appointments.getContent()),
            appointments.getPageable(),
            appointments.getTotalElements()
        );
    }

    @Override
    public List<Appointment> fetchBagRelationships(List<Appointment> appointments) {
        return Optional.of(appointments).map(this::fetchParticipants).orElse(Collections.emptyList());
    }

    Appointment fetchParticipants(Appointment result) {
        return entityManager
            .createQuery(
                "select appointment from Appointment appointment left join fetch appointment.participants where appointment.id = :id",
                Appointment.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Appointment> fetchParticipants(List<Appointment> appointments) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, appointments.size()).forEach(index -> order.put(appointments.get(index).getId(), index));
        List<Appointment> result = entityManager
            .createQuery(
                "select appointment from Appointment appointment left join fetch appointment.participants where appointment in :appointments",
                Appointment.class
            )
            .setParameter(APPOINTMENTS_PARAMETER, appointments)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
