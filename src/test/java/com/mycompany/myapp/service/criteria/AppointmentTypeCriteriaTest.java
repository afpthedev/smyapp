package com.mycompany.myapp.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class AppointmentTypeCriteriaTest {

    @Test
    void newAppointmentTypeCriteriaHasAllFiltersNullTest() {
        var appointmentTypeCriteria = new AppointmentTypeCriteria();
        assertThat(appointmentTypeCriteria).is(criteriaFiltersAre(Objects::isNull));
    }

    @Test
    void appointmentTypeCriteriaFluentMethodsCreatesFiltersTest() {
        var appointmentTypeCriteria = new AppointmentTypeCriteria();

        setAllFilters(appointmentTypeCriteria);

        assertThat(appointmentTypeCriteria).is(criteriaFiltersAre(Objects::nonNull));
    }

    @Test
    void appointmentTypeCriteriaCopyCreatesNullFilterTest() {
        var appointmentTypeCriteria = new AppointmentTypeCriteria();
        var copy = appointmentTypeCriteria.copy();

        assertThat(appointmentTypeCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::isNull)),
            criteria -> assertThat(criteria).isEqualTo(appointmentTypeCriteria)
        );
    }

    @Test
    void appointmentTypeCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var appointmentTypeCriteria = new AppointmentTypeCriteria();
        setAllFilters(appointmentTypeCriteria);

        var copy = appointmentTypeCriteria.copy();

        assertThat(appointmentTypeCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::nonNull)),
            criteria -> assertThat(criteria).isEqualTo(appointmentTypeCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var appointmentTypeCriteria = new AppointmentTypeCriteria();

        assertThat(appointmentTypeCriteria).hasToString("AppointmentTypeCriteria{}");
    }

    private static void setAllFilters(AppointmentTypeCriteria appointmentTypeCriteria) {
        appointmentTypeCriteria.id();
        appointmentTypeCriteria.name();
        appointmentTypeCriteria.description();
        appointmentTypeCriteria.color();
        appointmentTypeCriteria.isActive();
        appointmentTypeCriteria.distinct();
    }

    private static Condition<AppointmentTypeCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getName()) &&
                condition.apply(criteria.getDescription()) &&
                condition.apply(criteria.getColor()) &&
                condition.apply(criteria.getIsActive()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<AppointmentTypeCriteria> copyFiltersAre(
        AppointmentTypeCriteria copy,
        BiFunction<Object, Object, Boolean> condition
    ) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getName(), copy.getName()) &&
                condition.apply(criteria.getDescription(), copy.getDescription()) &&
                condition.apply(criteria.getColor(), copy.getColor()) &&
                condition.apply(criteria.getIsActive(), copy.getIsActive()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
