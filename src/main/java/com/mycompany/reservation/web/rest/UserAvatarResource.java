package com.mycompany.reservation.web.rest;

import com.mycompany.reservation.security.SecurityUtils;
import com.mycompany.reservation.service.UserService;
import com.mycompany.reservation.service.dto.AdminUserDTO;
import com.mycompany.reservation.service.dto.UserAvatarDTO;
import java.io.IOException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tech.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
public class UserAvatarResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserAvatarResource.class);

    private static final long MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

    private final UserService userService;

    public UserAvatarResource(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value = "/account/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdminUserDTO> uploadCurrentUserAvatar(@RequestParam("file") MultipartFile file) throws IOException {
        validateFile(file);
        String login = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current user could not be determined"));
        LOG.debug("REST request to update current user avatar");
        return ResponseUtil.wrapOrNotFound(userService.updateUserAvatar(login, file));
    }

    @PostMapping(value = "/admin/users/{login}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdminUserDTO> uploadUserAvatar(@PathVariable("login") String login, @RequestParam("file") MultipartFile file)
        throws IOException {
        validateFile(file);
        LOG.debug("REST request to update avatar for user: {}", login);
        return ResponseUtil.wrapOrNotFound(userService.updateUserAvatar(login, file));
    }

    @GetMapping(value = "/users/{login}/avatar")
    public ResponseEntity<byte[]> getUserAvatar(@PathVariable("login") String login) {
        LOG.debug("REST request to get avatar for user: {}", login);
        return buildAvatarResponse(userService.getUserAvatar(login));
    }

    @GetMapping(value = "/account/avatar")
    public ResponseEntity<byte[]> getCurrentUserAvatar() {
        String login = SecurityUtils.getCurrentUserLogin()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current user could not be determined"));
        LOG.debug("REST request to get current user avatar");
        return buildAvatarResponse(userService.getUserAvatar(login));
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Avatar dosyası boş olamaz");
        }

        if (file.getSize() > MAX_AVATAR_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Avatar dosyası 2MB sınırını aşıyor");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yalnızca görsel dosyaları yüklenebilir");
        }
    }

    private ResponseEntity<byte[]> buildAvatarResponse(Optional<UserAvatarDTO> avatarOptional) {
        return avatarOptional
            .map(avatar -> {
                MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
                if (avatar.contentType() != null) {
                    mediaType = MediaType.parseMediaType(avatar.contentType());
                }
                return ResponseEntity.ok().contentType(mediaType).body(avatar.data());
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
