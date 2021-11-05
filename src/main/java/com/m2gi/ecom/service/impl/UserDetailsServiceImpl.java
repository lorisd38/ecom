package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.UserDetails;
import com.m2gi.ecom.repository.UserDetailsRepository;
import com.m2gi.ecom.repository.UserRepository;
import com.m2gi.ecom.service.UserDetailsService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link UserDetails}.
 */
@Service
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    private final UserDetailsRepository userDetailsRepository;

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserDetailsRepository userDetailsRepository, UserRepository userRepository) {
        this.userDetailsRepository = userDetailsRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails save(UserDetails userDetails) {
        log.debug("Request to save UserDetails : {}", userDetails);
        Long userId = userDetails.getUser().getId();
        userRepository.findById(userId).ifPresent(userDetails::user);
        return userDetailsRepository.save(userDetails);
    }

    @Override
    public Optional<UserDetails> partialUpdate(UserDetails userDetails) {
        log.debug("Request to partially update UserDetails : {}", userDetails);

        return userDetailsRepository
            .findById(userDetails.getId())
            .map(existingUserDetails -> {
                if (userDetails.getRole() != null) {
                    existingUserDetails.setRole(userDetails.getRole());
                }
                if (userDetails.getBirthDate() != null) {
                    existingUserDetails.setBirthDate(userDetails.getBirthDate());
                }
                if (userDetails.getPhoneNumber() != null) {
                    existingUserDetails.setPhoneNumber(userDetails.getPhoneNumber());
                }

                return existingUserDetails;
            })
            .map(userDetailsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDetails> findAll() {
        log.debug("Request to get all UserDetails");
        return userDetailsRepository.findAllWithEagerRelationships();
    }

    public Page<UserDetails> findAllWithEagerRelationships(Pageable pageable) {
        return userDetailsRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDetails> findOne(Long id) {
        log.debug("Request to get UserDetails : {}", id);
        return userDetailsRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete UserDetails : {}", id);
        userDetailsRepository.deleteById(id);
    }
}
