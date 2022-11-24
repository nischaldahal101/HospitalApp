import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fyp/globals.dart';
import 'package:fyp/home_page.dart';
import 'package:fyp/authentication/sign_up.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../components/currentuser.dart';

class signIn extends StatefulWidget {
  const signIn({Key? key}) : super(key: key);

  @override
  _signInState createState() => _signInState();
}

class _signInState extends State<signIn> {
  TextEditingController _emailController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();
  late bool isLoading;

// Login Function
  login(String email, String password) async {
    String url = "https://fypapp123.herokuapp.com/api/auth/user?";
    SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
    Map body = {"email": email, "password": password};
    // ignore: prefer_typing_uninitialized_variables

    var res = await http.post(Uri.parse(url), body: body);
    var jsonResponse;
    // Api status
    if (res.statusCode == 200) {
      jsonResponse = json.decode(res.body);

      if (jsonResponse != null) {
        if (mounted) {
          setState(() {
            isLoading = false;
          });
        }
        sharedPreferences.setString("token", jsonResponse['token']);
        token = jsonResponse['token'];
        Get.snackbar('Successful', 'Login Success!',
            snackPosition: SnackPosition.BOTTOM);
        Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (BuildContext context) => HomePage()),
            (Route<dynamic> route) => false);
      }
    } else if (res.statusCode == 401) {
      jsonResponse = json.decode(res.body);

      if (jsonResponse != null) {
        setState(() {
          isLoading = false;
        });
        error = jsonResponse['msg'];
        Get.snackbar('Error', error, snackPosition: SnackPosition.BOTTOM);
      }
    }
  }

  Widget horizontalLine() => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: Container(
          width: 70,
          height: 1.0,
          color: Colors.grey[300],
        ),
      );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        body: Container(
          decoration: BoxDecoration(color: Theme.of(context).primaryColor),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const SizedBox(
                height: 50,
              ),
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const Text(
                      'Sign In',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 50,
                      ),
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    Container(
                      alignment: Alignment.center,
                      child: Image.asset(
                        'assets/family.png',
                        height: 200,
                        width: 200,
                      ),
                    )
                  ],
                ),
              ),
              const SizedBox(
                height: 20,
              ),
              Expanded(
                  child: Container(
                      decoration: const BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(60),
                              topRight: Radius.circular(60))),
                      child: SingleChildScrollView(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 20, vertical: 20),
                          child: Column(
                            children: <Widget>[
                              const SizedBox(height: 40),
                              Container(
                                padding: const EdgeInsets.all(10.0),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(30),
                                  boxShadow: [
                                    BoxShadow(
                                        color: Theme.of(context).primaryColor,
                                        blurRadius: 20,
                                        offset: Offset(0, 10))
                                  ],
                                ),
                                child: Column(
                                  children: <Widget>[
                                    Container(
                                      padding: EdgeInsets.all(10.0),
                                      decoration: BoxDecoration(
                                          border: Border(
                                        bottom: BorderSide(
                                            color: (Colors.purple[200])!),
                                      )),
                                      child: TextField(
                                        controller: _emailController,
                                        decoration: const InputDecoration(
                                            hintText: "Email",
                                            hintStyle: TextStyle(
                                                color: Color(0xff107163)),
                                            border: InputBorder.none),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.all(10.0),
                                      child: TextField(
                                        controller: _passwordController,
                                        decoration: const InputDecoration(
                                            hintText: "Password",
                                            hintStyle: TextStyle(
                                                color: Color(0xff107163)),
                                            border: InputBorder.none),
                                        obscureText: true,
                                      ),
                                    )
                                  ],
                                ),
                              ),
                              const SizedBox(
                                height: 40,
                              ),
                              SizedBox(
                                height: 40,
                                width: 200,
                                child: MaterialButton(
                                  shape: const RoundedRectangleBorder(
                                      borderRadius: BorderRadius.all(
                                          Radius.circular(10))),
                                  onPressed: () {
                                    if (_emailController.text == '' ||
                                        _passwordController.text == '') {
                                      Get.snackbar('Error', 'Empty field',
                                          snackPosition: SnackPosition.BOTTOM);
                                    } else {
                                      setState(() {
                                        isLoading = true;
                                      });
                                      login(_emailController.text,
                                          _passwordController.text);
                                    }
                                  },
                                  color: Colors.redAccent,
                                  child: const Text(
                                    'Login',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18),
                                  ),
                                ),
                              ),
                              const SizedBox(
                                height: 20,
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: <Widget>[
                                  Text(
                                    'New User? ',
                                    style: TextStyle(color: Colors.grey[800]),
                                  ),
                                  InkWell(
                                    onTap: () {
                                      Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                              builder: (context) => signUp()));
                                    },
                                    child: Text(
                                      'Register',
                                      style: TextStyle(
                                          color: Theme.of(context).primaryColor,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  )
                                ],
                              )
                            ],
                          ),
                        ),
                      ))),
            ],
          ),
        ));
  }
}
