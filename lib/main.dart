import 'package:flutter/material.dart';
import 'package:fyp/start.dart';
import 'home_page.dart';
import 'package:get/get.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color.fromRGBO(20, 20, 102, 20),
        secondaryHeaderColor: Colors.blueGrey[300],
      ),
      home: StartMenu(),
    );
  }
}
