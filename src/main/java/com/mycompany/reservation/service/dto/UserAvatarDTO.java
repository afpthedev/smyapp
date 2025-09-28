package com.mycompany.reservation.service.dto;

/**
 * A DTO representing the binary data for a user's avatar image.
 */
public record UserAvatarDTO(byte[] data, String contentType) {}
