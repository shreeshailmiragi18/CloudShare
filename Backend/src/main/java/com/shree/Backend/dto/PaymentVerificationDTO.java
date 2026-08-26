package com.shree.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerificationDTO {

    private String razorpay_order_id;
    private String razorpay_payment_id;
    private String razorpay_signature;
    private String planId;
}
