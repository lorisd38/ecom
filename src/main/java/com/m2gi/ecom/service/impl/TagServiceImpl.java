package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.Tag;
import com.m2gi.ecom.repository.TagRepository;
import com.m2gi.ecom.service.TagService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Tag}.
 */
@Service
@Transactional
public class TagServiceImpl implements TagService {

    private final Logger log = LoggerFactory.getLogger(TagServiceImpl.class);

    private final TagRepository tagRepository;

    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public Tag save(Tag tag) {
        log.debug("Request to save Tag : {}", tag);
        return tagRepository.save(tag);
    }

    @Override
    public Optional<Tag> partialUpdate(Tag tag) {
        log.debug("Request to partially update Tag : {}", tag);

        return tagRepository
            .findById(tag.getId())
            .map(existingTag -> {
                if (tag.getName() != null) {
                    existingTag.setName(tag.getName());
                }
                if (tag.getColor() != null) {
                    existingTag.setColor(tag.getColor());
                }

                return existingTag;
            })
            .map(tagRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tag> findAll() {
        log.debug("Request to get all Tags");
        return tagRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tag> findOne(Long id) {
        log.debug("Request to get Tag : {}", id);
        return tagRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tag : {}", id);
        tagRepository.deleteById(id);
    }
}
