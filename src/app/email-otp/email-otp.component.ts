import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import '../../assets/smtp.js';
declare let Email: any;

@Component({
  selector: 'app-email-otp',
  templateUrl: './email-otp.component.html',
  styleUrls: ['./email-otp.component.css'],
})
export class EmailOtpComponent implements OnInit {
  emailForm: FormGroup;
  showOTPsection: boolean = false;
  editMode: boolean = true;
  otp_val: string;
  emailPattern = '^[a-z0-9._%+-]+@dso.org.sg';
  displayTimer: any;
  counter: number = 1;
  timeInterval: any;
  otpError: boolean = false;
  showResendBtn: boolean = false;
  otpVerificationError: boolean = false;
  loggedIn: boolean = false;

  ngOnInit() {
    /*Setup Rective Form*/
    this.emailForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      otp: new FormControl(null, [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
      ]),
    });
  }

  /*Send OTP button Handler*/
  sendOTP() {
    this.otpError = false;
    this.otpVerificationError = false;
    const user_email = this.emailForm.controls['email'].value;
    this.emailForm.get('otp').reset();
    this.otp_val = this.geneateOTP();
    const emailBody = `<h1>OTP Verification Email</h1>
    <h2>Your OTP is: </h2>${this.otp_val}`;
    this.sendEmail(emailBody, user_email);
  }

  /*Generate 6 digit OTP with leading 0 */
  geneateOTP() {
    const otp = Math.floor(Math.random() * 90000) + 10000;
    return otp.toString().padStart(6, '0');
  }

  /*Send email from client side using SMTP js*/
  sendEmail(emailBody: string, user_email: string) {
    Email.send({
      SecureToken: '372a4816-da52-426a-862a-8a6ea07fa757',
      To: user_email,
      From: 'smtp.test1685@gmail.com',
      Subject: 'OTP Verification',
      Body: emailBody,
    }).then((message: string) => {
      if (message === 'OK') {
        alert(`OTP sent to your email ${user_email}`);
        this.timer(1);
        this.editMode = false;
      } else {
        console.log(message);
      }
    });
  }

  /*Verify OTP button Handler */
  onVerifyOTP() {
    /*Redirect to Generate OTP view after 10 unsuccesful attempts */
    if (this.counter > 10) {
      this.counter = 0;
      this.emailForm.get('otp').reset();
      this.showResendBtn = true;
      clearInterval(this.timeInterval);
      this.otpError = false;
      this.editMode = true;
      this.otpVerificationError = true;
    }
    const entered_otp_val = this.emailForm.controls['otp'].value;
    if (this.otp_val === entered_otp_val) {
      this.otpError = false;
      this.loggedIn = true;
      clearInterval(this.timeInterval);
    } else {
      this.otpError = true;
    }
    this.counter++;
  }

  /*Run a timer for 1 minute on successful OTP generation*/
  timer(minute: number) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timeInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.displayTimer = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        this.editMode = true;
        this.showResendBtn = true;
        clearInterval(this.timeInterval);
      }
    }, 1000);
  }

  /* Edit button Handler*/
  changeEmail(e: Event) {
    e.preventDefault();
    clearInterval(this.timeInterval);
    this.emailForm.get('otp').reset();
    this.otpError = false;
    this.editMode = true;
    this.showResendBtn = false;
  }

  /*Disable button when the form fields are invalid */
  diableBtn(btnName: string) {
    if (btnName === 'email') {
      return this.emailForm.get('email').status === 'INVALID';
    } else {
      return this.emailForm.get('otp').status === 'INVALID';
    }
  }

  /*Redirect to Generate OTP view on clicking logout button */
  logOut() {
    this.editMode = true;
    this.loggedIn = false;
  }
}
