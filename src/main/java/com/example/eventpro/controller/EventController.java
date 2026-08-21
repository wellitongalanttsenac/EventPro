package com.example.eventpro.controller;

import com.example.eventpro.entities.Event;
import com.example.eventpro.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("event")
public class EventController {

    @Autowired
    public EventRepository eventRepository;

    @GetMapping
    public ResponseEntity<List<Event>> list() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Event> create(@RequestBody Event event){

        var eventDB = eventRepository.save(event);

        return ResponseEntity.ok(eventDB);
    }
}
