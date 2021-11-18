package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.Cart;
import com.m2gi.ecom.repository.CartRepository;
import com.m2gi.ecom.service.CartService;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Cart}.
 */
@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final Logger log = LoggerFactory.getLogger(CartServiceImpl.class);

    private final CartRepository cartRepository;

    public CartServiceImpl(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Override
    public Cart save(Cart cart) {
        log.debug("Request to save Cart : {}", cart);
        return cartRepository.save(cart);
    }

    @Override
    public Optional<Cart> partialUpdate(Cart cart) {
        log.debug("Request to partially update Cart : {}", cart);

        return cartRepository
            .findById(cart.getId())
            .map(existingCart -> {
                return existingCart;
            })
            .map(cartRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Cart> findAll() {
        log.debug("Request to get all Carts");
        return cartRepository.findAll();
    }

    /**
     *  Get all the carts where User is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Cart> findAllWhereUserIsNull() {
        log.debug("Request to get all carts where User is null");
        return StreamSupport
            .stream(cartRepository.findAll().spliterator(), false)
            .filter(cart -> cart.getUser() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Cart> findOne(Long id) {
        log.debug("Request to get Cart : {}", id);
        return cartRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Cart : {}", id);
        cartRepository.deleteById(id);
    }
}
