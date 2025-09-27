package com.mycompany.reservation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.reservation.domain.enumeration.BusinessType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Business.
 */
@Entity
@Table(name = "business")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Business implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private BusinessType type;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "description")
    private String description;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "business")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "business" }, allowSetters = true)
    private Set<Service> services = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "business")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "service", "customer", "business" }, allowSetters = true)
    private Set<Reservation> reservations = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "business")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reservation", "customer", "business" }, allowSetters = true)
    private Set<Payment> payments = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "business")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "business" }, allowSetters = true)
    private Set<Customer> customers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Business id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Business name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BusinessType getType() {
        return this.type;
    }

    public Business type(BusinessType type) {
        this.setType(type);
        return this;
    }

    public void setType(BusinessType type) {
        this.type = type;
    }

    public String getAddress() {
        return this.address;
    }

    public Business address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return this.phone;
    }

    public Business phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return this.email;
    }

    public Business email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescription() {
        return this.description;
    }

    public Business description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Service> getServices() {
        return this.services;
    }

    public void setServices(Set<Service> services) {
        if (this.services != null) {
            this.services.forEach(i -> i.setBusiness(null));
        }
        if (services != null) {
            services.forEach(i -> i.setBusiness(this));
        }
        this.services = services;
    }

    public Business services(Set<Service> services) {
        this.setServices(services);
        return this;
    }

    public Business addServices(Service service) {
        this.services.add(service);
        service.setBusiness(this);
        return this;
    }

    public Business removeServices(Service service) {
        this.services.remove(service);
        service.setBusiness(null);
        return this;
    }

    public Set<Reservation> getReservations() {
        return this.reservations;
    }

    public void setReservations(Set<Reservation> reservations) {
        if (this.reservations != null) {
            this.reservations.forEach(i -> i.setBusiness(null));
        }
        if (reservations != null) {
            reservations.forEach(i -> i.setBusiness(this));
        }
        this.reservations = reservations;
    }

    public Business reservations(Set<Reservation> reservations) {
        this.setReservations(reservations);
        return this;
    }

    public Business addReservations(Reservation reservation) {
        this.reservations.add(reservation);
        reservation.setBusiness(this);
        return this;
    }

    public Business removeReservations(Reservation reservation) {
        this.reservations.remove(reservation);
        reservation.setBusiness(null);
        return this;
    }

    public Set<Payment> getPayments() {
        return this.payments;
    }

    public void setPayments(Set<Payment> payments) {
        if (this.payments != null) {
            this.payments.forEach(i -> i.setBusiness(null));
        }
        if (payments != null) {
            payments.forEach(i -> i.setBusiness(this));
        }
        this.payments = payments;
    }

    public Business payments(Set<Payment> payments) {
        this.setPayments(payments);
        return this;
    }

    public Business addPayments(Payment payment) {
        this.payments.add(payment);
        payment.setBusiness(this);
        return this;
    }

    public Business removePayments(Payment payment) {
        this.payments.remove(payment);
        payment.setBusiness(null);
        return this;
    }

    public Set<Customer> getCustomers() {
        return this.customers;
    }

    public void setCustomers(Set<Customer> customers) {
        if (this.customers != null) {
            this.customers.forEach(i -> i.setBusiness(null));
        }
        if (customers != null) {
            customers.forEach(i -> i.setBusiness(this));
        }
        this.customers = customers;
    }

    public Business customers(Set<Customer> customers) {
        this.setCustomers(customers);
        return this;
    }

    public Business addCustomers(Customer customer) {
        this.customers.add(customer);
        customer.setBusiness(this);
        return this;
    }

    public Business removeCustomers(Customer customer) {
        this.customers.remove(customer);
        customer.setBusiness(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Business)) {
            return false;
        }
        return getId() != null && getId().equals(((Business) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Business{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", address='" + getAddress() + "'" +
            ", phone='" + getPhone() + "'" +
            ", email='" + getEmail() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
