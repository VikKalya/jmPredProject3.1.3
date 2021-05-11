package com.example.demo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.User;
import com.example.demo.service.RoleService;
import com.example.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminRestController {

    @Autowired
    private UserService userService;


    @PreAuthorize(value = "hasAuthority('ADMIN') or hasAuthority('ADMIN,USER')")
    @GetMapping
    public List<User> showAllUsers() {
        return userService.allUsers();
    }

    @PreAuthorize(value = "hasAuthority('ADMIN') or hasAuthority('ADMIN,USER')")
    @GetMapping("{id}")
    public User showUserById(@PathVariable Integer id){
        return userService.getById(id);
    }
    @PreAuthorize(value = "hasAuthority('ADMIN') or hasAuthority('ADMIN,USER')")
    @PostMapping
    public  List<User> createNewUser(@RequestBody User user) {
        userService.add(user);
        return userService.allUsers();
    }

    @GetMapping("/principal")
    public User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            User secUser = (User) authentication.getPrincipal();
            System.out.println(secUser);
            return userService.loadUserByUsername(secUser.getUsername());
        }

        return null;
    }


    @PreAuthorize(value = "hasAuthority('ADMIN') or hasAuthority('ADMIN,USER')")
    @PutMapping
    public List<User> updateUser(@RequestBody User user) {
        userService.edit(user);
        return userService.allUsers();
    }

    @PreAuthorize(value = "hasAuthority('ADMIN') or hasAuthority('ADMIN,USER')")
    @DeleteMapping
    public List<User> deleteUser(@RequestBody User user) {
        userService.delete(user);
        return userService.allUsers();
    }
}

