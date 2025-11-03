package com.example.my_project.service;

import com.example.my_project.dto.BookingRequest;

public interface ITempBookingService {
    void lockSlots(BookingRequest request, String txnRef);
    void unlockSlots(String txnRef);
    void cleanupExpired();
}
