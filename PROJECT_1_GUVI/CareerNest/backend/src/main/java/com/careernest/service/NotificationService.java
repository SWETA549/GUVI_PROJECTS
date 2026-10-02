package com.careernest.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final String sid;
    private final String token;
    private final String from;

    public NotificationService(@Value("${twilio.account-sid}") String sid,
                                @Value("${twilio.auth-token}") String token,
                                @Value("${twilio.phone-number}") String from) {
        this.sid = sid;
        this.token = token;
        this.from = from;
    }

    public void sendSms(String to, String body) {
        if (sid == null || sid.isBlank() || token == null || token.isBlank() ||
                from == null || from.isBlank() || to == null || to.isBlank()) {
            System.out.println("[SMS DEMO] To: " + to + " | " + body);
            return;
        }
        Twilio.init(sid, token);
        Message.creator(new PhoneNumber(to), new PhoneNumber(from), body).create();
    }
}
