package com.m2gi.ecom.service.errors;

public class VersionConflictException extends RuntimeException {

    public VersionConflictException() {
        super("The version has evolved compared to the beginning of the transaction.");
    }
}
