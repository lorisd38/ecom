package com.m2gi.ecom.web.rest.errors;

public class InsufficientQuantityException extends BadRequestAlertException {

    public InsufficientQuantityException() {
        super(ErrorConstants.INSUFFICIENT_QUANTITY, "The available quantity is insufficient", "productManagement", "insufficientquantity");
    }
}
