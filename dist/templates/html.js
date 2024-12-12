"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML = void 0;
class HTML {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    pendingOwner() {
        const message = `
             <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Pending Approval</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>Thank you for registering as a vehicle owner with Gulf Transportation Solution.</p>
                        <p>Your account is currently pending approval from our team. We will notify you once your account has been reviewed and accepted.</p>
                        <p>We appreciate your patience and are looking forward to having you on board.</p>
                        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    acceptOwner() {
        const message = `
             <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Accepted</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>We are pleased to inform you that your account as a vehicle owner has been accepted by our team.</p>
                        <p>Thank you for choosing Gulf Transportation Solution. We are excited to have you on board and look forward to a successful partnership.</p>
                        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    rejectOwner() {
        const message = `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Rejected</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>Thank you for registering as a vehicle owner with Gulf Transportation Solution.</p>
                        <p>We regret to inform you that your account registration has been reviewed and rejected by our system admin.</p>
                        <p>If you have any questions or believe this decision was made in error, please feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>We appreciate your understanding.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    pendingDriver(firstName, lastName) {
        const message = `
             <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Pending Approval</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>Thank you for registering Driver <strong>${firstName} ${lastName}</strong> with Gulf Transportation Solution.</p>
                        <p>Your Driver is currently pending for approval from our team. We will notify you once the Driver has been reviewed and accepted.</p>
                        <p>We appreciate your patience and are looking forward to having you on board.</p>
                        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    acceptDriver(firstName, lastName) {
        const message = `
             <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Accepted</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>We are pleased to inform you , that your Driver <strong>${firstName} ${lastName}</strong> has been accepted and registred by our team.</p>
                        <p>We are looking forward to provide services through these registrations.</p>
                        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    acceptDriverToDriver(userName, password) {
        const message = `
             <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Accepted</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>Congratulations! You have been successfully registered as a driver on Gulf Transportation Solution.</p>
                        <p>Here are your login details:</p>
                        <ul>
                            <li><b>Username:</b> ${userName}</li>
                            <li><b>Password:</b> ${password}</li>
                        </ul>
                        <p>Please login to your account using the above credentials and change your password for security reasons.</p>
                        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Welcome aboard and safe driving!</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    rejectDriver(firstName, lastName) {
        const message = `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Rejected</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>We are sorry to inform you , that your Driver <strong>${firstName} ${lastName}</strong> has been reviewed and rejected by our team.</p>
                        <p>We apologize for the inconvenience.</p>
                        <p>If you have any questions or believe this decision was made in error, please feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>We appreciate your understanding.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    pendingVehicle(vehicleNo) {
        const message = `
             <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Vehicle Pending Approval</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>Thank you for registering Vehicle No:${vehicleNo} with Gulf Transportation Solution.</p>
                        <p>Your vehicle is currently pending for approval from our team. We will notify you once the Vehicle has been reviewed and accepted.</p>
                        <p>We appreciate your patience and are looking forward to having you on board.</p>
                        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    acceptVehicle(vehicleNo) {
        const message = `
             <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Vehicle Pending Approval</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>We are pleased to inform you , that your Vehicle (${vehicleNo}) has been accepted and registred by our team.</p>
                        <p>We are looking forward to provide services through these registrations.</p>
                        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    rejectVehicle(vehicleNo) {
        const message = `
             <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Vehicle Pending Approval</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>We are sorry to inform you , that your Vehicle (${vehicleNo}) has been reviewed and rejected by our team.</p>
                        <p>We apologize for the inconvenience.</p>
                        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    createCustomer() {
        const message = `
             <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Pending Approval</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>Your account has been created sucessfully.</p>
                        <p>Thank you for partnering with Gulf Transportation Solution.</p>
                        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                    </div>
                    <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    startRide(driverFName, driverLName, driverPhone, bookingId) {
        const message = `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Driver On the Way</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Gulf Transportation Solution</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                            <p>Your driver is on the way!</p>
                            <p>Here are the details of your ride:</p>
                            <ul>
                                <li><b>Driver Name:</b> ${driverFName} ${driverLName}</li>
                                <li><b>Phone Number:</b> ${driverPhone}</li>
                                <li><b>Booking ID:</b> ${bookingId}</li>
                            </ul>
                            <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                            <p>Thank you for choosing Gulf Transportation Solution. We hope you have a smooth ride ahead!</p>
                            <p>Best regards,</p>
                            <p>Gulf Transportation Solution Team</p>
                            <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
                </html>
        `;
        return message;
    }
    boookingComplete(bookingId, bookingDate) {
        const message = `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Booking Confirmation</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 5px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            max-width: 600px;
                            margin: 40px auto;
                        }
                        .header {
                            background-color: #fdb940;
                            color: #ffffff;
                            padding: 10px 20px;
                            border-top-left-radius: 5px;
                            border-top-right-radius: 5px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #777;
                            margin-top: 20px;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            color: #ffffff;
                            background-color: #fdb940;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                        .details {
                            list-style: none;
                            padding: 0;
                        }
                        .details li {
                            margin-bottom: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Gulf Transportation Solution</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                            <p>Your booking has been successfully completed!</p>
                            <p>Here are the details of your booking:</p>
                            <ul class="details">
                                <li><b>Booking ID:</b> ${bookingId}</li>
                                <li><b>Date:</b> ${bookingDate}</li>
                            </ul>
                            <p>We appreciate you choosing Gulf Transportation Solution. If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                            <p>Thank you for using our service! We look forward to serving you again.</p>
                            <p>Best regards,</p>
                            <p>Gulf Transportation Solution Team</p>
                            <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `;
        return message;
    }
    driverAtPickupLoc(bookingId, driverFName, driverLName, driverPhone) {
        const message = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Driver Arrival Notification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        max-width: 600px;
                        margin: 40px auto;
                    }
                    .header {
                        background-color: #fdb940;
                        color: #ffffff;
                        padding: 10px 20px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #fdb940;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    .details {
                        list-style: none;
                        padding: 0;
                    }
                    .details li {
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Gulf Transportation Solution</h1>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                        <p>Your assigned driver has arrived at the stock pickup location!</p>
                        <p>Here are the details of your booking and driver:</p>
                        <ul class="details">
                            <li><b>Booking ID:</b> ${bookingId}</li>
                            <li><b>Driver Name:</b> ${driverFName} ${driverLName}</li>
                            <li><b>Driver Contact:</b> ${driverPhone}</li>
                        </ul>
                        <p>If you need assistance, feel free to reach out to us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                        <p>Thank you for using Gulf Transportation Solution. We are committed to providing you with the best service possible!</p>
                        <p>Best regards,</p>
                        <p>Gulf Transportation Solution Team</p>
                        <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                </div>
            </body>
            </html>
        `;
        return message;
    }
    driverAtUnloadingLoc(bookingId, driverFName, driverLName, driverPhone) {
        const message = `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Driver Arrival Notification - Unloading Location</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 5px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            max-width: 600px;
                            margin: 40px auto;
                        }
                        .header {
                            background-color: #fdb940;
                            color: #ffffff;
                            padding: 10px 20px;
                            border-top-left-radius: 5px;
                            border-top-right-radius: 5px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #777;
                            margin-top: 20px;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            color: #ffffff;
                            background-color: #fdb940;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                        .details {
                            list-style: none;
                            padding: 0;
                        }
                        .details li {
                            margin-bottom: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Gulf Transportation Solution</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                            <p>Your driver has arrived at the stock unloading location!</p>
                            <p>Here are the details of your booking and driver:</p>
                            <ul class="details">
                                <li><b>Booking ID:</b> ${bookingId}</li>
                                <li><b>Driver Name:</b> ${driverFName} ${driverLName}</li>
                                <li><b>Driver Contact:</b> ${driverPhone}</li>
                            </ul>
                            <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                            <p>Thank you for using Gulf Transportation Solution. We hope your experience was smooth, and we look forward to serving you again!</p>
                            <p>Best regards,</p>
                            <p>Gulf Transportation Solution Team</p>
                            <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
                </html>
        `;
        return message;
    }
    sendOtp(otpCode) {
        const message = `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>OTP Verification - Gulf Transportation Solution</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 5px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            max-width: 600px;
                            margin: 40px auto;
                        }
                        .header {
                            background-color: #fdb940;
                            color: #ffffff;
                            padding: 10px 20px;
                            border-top-left-radius: 5px;
                            border-top-right-radius: 5px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #777;
                            margin-top: 20px;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            color: #ffffff;
                            background-color: #fdb940;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #fdb940;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Gulf Transportation Solution</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>${this.firstName} ${this.lastName}</strong>,</p>
                            <p>Your OTP for verifying your account is:</p>
                            <p class="otp">${otpCode}</p>
                            <p>Please enter this code to complete your verification process. The code is valid for 10 minutes.</p>
                            <p>If you didn’t request this, please ignore this email or contact our support team at <a href="mailto:gulftransportationsolution@gmail.com">gulftransportationsolution@gmail.com</a>.</p>
                            <p>Thank you for using Gulf Transportation Solution!</p>
                            <p>Best regards,</p>
                            <p>Gulf Transportation Solution Team</p>
                            <a href="https://gulf-stock-transportation.netlify.app" class="button">Visit Our Website</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Gulf Transportation Solution. All rights reserved.</p>
                    </div>
                </body>
                </html>
        `;
        return message;
    }
    ;
}
exports.HTML = HTML;
//# sourceMappingURL=html.js.map