package com.m2gi.ecom.service.errors;

public class InsufficientQuantityException extends RuntimeException {

    public InsufficientQuantityException() {
        super("Insufficient quantity for the operation.");
    }
}
