package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.Cart;
import com.m2gi.ecom.domain.Product;
import com.m2gi.ecom.domain.ProductCart;
import com.m2gi.ecom.repository.CartRepository;
import com.m2gi.ecom.repository.ProductCartRepository;
import com.m2gi.ecom.repository.ProductRepository;
import com.m2gi.ecom.service.CartService;
import com.m2gi.ecom.service.errors.InsufficientQuantityException;
import com.m2gi.ecom.service.errors.VersionConflictException;
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

    private final ProductRepository productRepository;
    private final ProductCartRepository productCartRepository;

    public CartServiceImpl(
        CartRepository cartRepository,
        ProductRepository productRepository,
        ProductCartRepository productCartRepository
    ) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.productCartRepository = productCartRepository;
    }

    @Override
    public ProductCart addLine(ProductCart line) {
        boolean applied = false;
        while (!applied) {
            try {
                createLineAndUpdateProductQuantity(line);
                applied = true;
            } catch (VersionConflictException ignored) {}
        }

        return productCartRepository.save(line);
    }

    @Override
    public ProductCart updateLine(Long lineId, int newQuantity) {
        final ProductCart line = productCartRepository.findById(lineId).orElseThrow();
        final int deltaQuantity = newQuantity - line.getQuantity();
        line.setQuantity(newQuantity);

        boolean applied = false;
        while (!applied) {
            try {
                updateLineAndProductQuantity(line, deltaQuantity);
                applied = true;
            } catch (VersionConflictException ignored) {}
        }

        return productCartRepository.save(line);
    }

    @Override
    public void removeLine(Long lineId) {
        final ProductCart line = productCartRepository.findById(lineId).orElseThrow();
        boolean applied = false;
        while (!applied) {
            try {
                deleteLineAndUpdateProductQuantity(line);
                applied = true;
            } catch (VersionConflictException ignored) {}
        }
    }

    private void createLineAndUpdateProductQuantity(ProductCart line) {
        final Product original = productRepository.findById(line.getProduct().getId()).orElseThrow();
        final int newQuantity = original.getQuantity() - line.getQuantity();

        if (newQuantity < 0) {
            throw new InsufficientQuantityException();
        }

        original.setQuantity(newQuantity);
        final Product updated = productRepository.save(original);
        if (updated.getVersion().equals(original.getVersion() + 1)) {
            throw new VersionConflictException();
        }
    }

    private void updateLineAndProductQuantity(ProductCart line, int deltaQuantity) {
        final Product original = productRepository.findById(line.getProduct().getId()).orElseThrow();
        final int newQuantity = original.getQuantity() - deltaQuantity;

        if (newQuantity < 0) {
            throw new InsufficientQuantityException();
        }

        original.setQuantity(newQuantity);
        final Product updated = productRepository.save(original);
        if (updated.getVersion().equals(original.getVersion() + 1)) {
            throw new VersionConflictException();
        }
    }

    private void deleteLineAndUpdateProductQuantity(ProductCart line) {
        final Product original = productRepository.findById(line.getProduct().getId()).orElseThrow();
        final int newQuantity = original.getQuantity() + line.getQuantity();
        original.setQuantity(newQuantity);
        final Product updated = productRepository.save(original);
        if (updated.getVersion().equals(original.getVersion() + 1)) {
            throw new VersionConflictException();
        }
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
    public Optional<Cart> findOneWithEagerRelationshipsByLogin(String login) {
        final Optional<Cart> result = cartRepository.findOneWithEagerRelationshipsByLogin(login);
        result.ifPresent(value -> value.getLines().forEach(pc -> pc.getProduct().getTags().isEmpty()));
        return result;
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
