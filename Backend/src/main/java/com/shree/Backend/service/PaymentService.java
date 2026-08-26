package com.shree.Backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.shree.Backend.documents.PaymentTransaction;
import com.shree.Backend.documents.ProfileDocument;
import com.shree.Backend.dto.PaymentDTO;
import com.shree.Backend.dto.PaymentVerificationDTO;
import com.shree.Backend.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
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

    public PaymentDTO verifyPayment(PaymentVerificationDTO paymentVerificationDTO) {
        try{
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();

            String data = paymentVerificationDTO.getRazorpay_order_id()+"|"+paymentVerificationDTO.getRazorpay_payment_id();
            String generatedSignature = generateHmacSha256Signature(data,razorpaySecret);
            if(!generatedSignature.equals(paymentVerificationDTO.getRazorpay_signature())){
                updateTransactionStatus(paymentVerificationDTO.getRazorpay_order_id(),"FAILED",paymentVerificationDTO.getRazorpay_payment_id(),null);
                return PaymentDTO.builder()
                        .success(false)
                        .message("Payment signature verification failed")
                        .build();
            }
            //add credits based on plan
            int creditsToAdd=0;
            String plan = "BASIC";
            switch(paymentVerificationDTO.getPlanId()){
                case "basic":
                    creditsToAdd =100;
                    plan = "BASIC";
                    break;
                case "premium":
                    creditsToAdd = 500;
                    plan = "PREMIUM";
                    break;
                case "ultimate":
                    creditsToAdd = 1000;
                    plan = "ULTIMATE";
                    break;
            }

            if(creditsToAdd > 0){
                userCreditsService.addCredits(clerkId,creditsToAdd,plan);
                updateTransactionStatus(paymentVerificationDTO.getRazorpay_order_id(),"SUCCESS",paymentVerificationDTO.getRazorpay_payment_id(),creditsToAdd);
                return PaymentDTO.builder()
                        .success(true)
                        .message("Payment verified and credits added successfully")
                        .credits(userCreditsService.getUserCredits(clerkId).getCredits())
                        .build();
            }else{
                updateTransactionStatus(paymentVerificationDTO.getRazorpay_order_id(),"FAILED",paymentVerificationDTO.getRazorpay_payment_id(),null);
                return PaymentDTO.builder()
                        .success(false)
                        .message("Invalid plan selected")
                        .build();
            }
        }catch (Exception e){
            try{
                updateTransactionStatus(paymentVerificationDTO.getRazorpay_order_id(),"ERROR",paymentVerificationDTO.getRazorpay_payment_id(),null);
            }catch (Exception ex){
                throw new RuntimeException(ex);
            }
            return PaymentDTO.builder()
                    .success(false)
                    .message("ERROR verifying payment: "+e.getMessage())
                    .build();

        }
    }

    private String generateHmacSha256Signature(
            String data,
            String razorpaySecret
    ) throws NoSuchAlgorithmException, InvalidKeyException {

        Mac mac = Mac.getInstance("HmacSHA256");

        SecretKeySpec secretKey = new SecretKeySpec(
                razorpaySecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );

        mac.init(secretKey);

        byte[] hash = mac.doFinal(
                data.getBytes(StandardCharsets.UTF_8)
        );

        StringBuilder hexString = new StringBuilder();

        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);

            if (hex.length() == 1) {
                hexString.append('0');
            }

            hexString.append(hex);
        }

        return hexString.toString();
    }

    private void updateTransactionStatus(String razorpayOrderId, String status, String razorpayPaymentId, Integer creditsToAdd) {
        paymentTransactionRepository.findAll().stream()
                .filter(t -> t.getOrderId() != null && t.getOrderId().equals(razorpayOrderId) )
                .findFirst()
                .map(transaction -> {
                    transaction.setStatus(status);
                    transaction.setPaymentId(razorpayPaymentId);
                    if(creditsToAdd != null){
                        transaction.setCreditsAdded(creditsToAdd);
                    }
                    return paymentTransactionRepository.save(transaction);
                })
                .orElse(null);

    }
}
