package com.example.my_project.dto.users;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BankCallbackDto {

    private String transactionId;
    private String description;
    private Long amount;
    private String bankAccount;
    private String bankCode;
    private String time;
}