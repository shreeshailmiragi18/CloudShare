package com.shree.Backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.shree.Backend.documents.PaymentTransaction;
import com.shree.Backend.documents.ProfileDocument;
import com.shree.Backend.dto.PaymentDTO;
import com.shree.Backend.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyID;
    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    public PaymentDTO createOrder(PaymentDTO paymentDTO) {

        try{
           ProfileDocument currentProfile = profileService.getCurrentProfile();
           String clerkId = currentProfile.getClerkId();

            log.info("user with clerkId: "+currentProfile.getClerkId()+ "entered payment service to create order");

           RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyID, razorpaySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", paymentDTO.getAmount());
            orderRequest.put("currency", paymentDTO.getCurrency());
            orderRequest.put("receipt", "order_"+System.currentTimeMillis());
            Order orderResponse = razorpayClient.orders.create(orderRequest);
            String orderId = orderResponse.get("id");

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .clerkId(clerkId)
                    .orderId(orderId)
                    .planId(paymentDTO.getPlanId())
                    .amount(paymentDTO.getAmount())
                    .currency(paymentDTO.getCurrency())
                    .status("PENDING")
                    .transactionDate(LocalDateTime.now())
                    .userEmail(currentProfile.getEmail())
                    .userName(currentProfile.getFirstName()+" "+currentProfile.getLastName())
                    .build();

            paymentTransactionRepository.save(transaction);

            return PaymentDTO.builder()
                    .orderId(orderId)
                    .success(true)
                    .message("Order Created Successfully")
                    .build();
        }catch (Exception e){
            e.printStackTrace();
            return PaymentDTO.builder()
                    .success(false)
                    .message("Error while creating Order"+e.getMessage())
                    .build();
        }
    }
}
