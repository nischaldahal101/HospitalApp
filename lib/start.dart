import 'package:flutter/material.dart';
import 'package:fyp/home_page.dart';
import 'package:fyp/authentication/sign_in.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:introduction_screen/introduction_screen.dart';

class StartMenu extends StatelessWidget {
  const StartMenu({Key? key}) : super(key: key);

  List<PageViewModel> getPages() {
    return [
      PageViewModel(
        image: Image.asset('assets/hospital.png'),
        titleWidget: Center(
          child: Container(
            child: Text('Hospital From Your Phone',
                style: GoogleFonts.concertOne(
                  textStyle: const TextStyle(color: Colors.white, fontSize: 30),
                )),
          ),
        ),
        bodyWidget: Container(
          margin: const EdgeInsets.all(20),
          child: const Text(
            'Hospital made available from your phone',
            style: TextStyle(color: Colors.white),
          ),
        ),
        footer: Container(
          padding: const EdgeInsets.all(15),
          height: 100,
          width: 200,
          decoration: const BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(20)),
              color: Colors.white),
          child: Image.asset('assets/logo.jpg'),
        ),
      ),
      PageViewModel(
        titleWidget: Center(
          child: Container(
            child: Text('Book Appointment in One Tap',
                style: GoogleFonts.concertOne(
                  textStyle: const TextStyle(color: Colors.white, fontSize: 30),
                )),
          ),
        ),
        image: Image.asset('assets/appointment.png'),
        bodyWidget: Container(
          margin: const EdgeInsets.all(20),
          child: const Text(
            'Booking appointments with doctor or rooms in hospital done with one tap of the finger',
            style: TextStyle(color: Colors.white),
          ),
        ),
        footer: Container(
          height: 100,
          width: 200,
          decoration: const BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(20)),
              color: Colors.white),
          child: Image.asset('assets/logo.jpg'),
        ),
      ),
      PageViewModel(
        image: Image.asset('assets/ambulance.png'),
        titleWidget: Center(
          child: Container(
            child: Text('Emergency Service',
                style: GoogleFonts.concertOne(
                  textStyle: const TextStyle(color: Colors.white, fontSize: 30),
                )),
          ),
        ),
        bodyWidget: Container(
          margin: const EdgeInsets.all(20),
          child: const Text(
            'Get Ambulance at your location with a single click',
            style: TextStyle(color: Colors.white),
          ),
        ),
        footer: Container(
          height: 100,
          width: 200,
          decoration: const BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(20)),
              color: Colors.white),
          child: Image.asset('assets/logo.jpg'),
        ),
      )
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IntroductionScreen(
        done: const Text(
          'Done',
          style: TextStyle(color: Colors.white),
        ),
        onDone: () {
          Navigator.push(
              context, MaterialPageRoute(builder: (context) => const signIn()));
        },
        showSkipButton: true,
        skip: const Text(
          'Skip',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        pages: getPages(),
        showNextButton: true,
        dotsDecorator: const DotsDecorator(activeColor: Colors.white),
        next: const Icon(
          Icons.arrow_forward,
          color: Colors.white,
        ),
        globalBackgroundColor: Theme.of(context).primaryColor,
      ),
    );
  }
}
