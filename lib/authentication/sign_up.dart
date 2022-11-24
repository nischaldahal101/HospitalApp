import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fyp/home_page.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fyp/globals.dart';
import 'package:get/get.dart';

class signUp extends StatefulWidget {
  const signUp({Key? key}) : super(key: key);

  @override
  _signUpState createState() => _signUpState();
}

class _signUpState extends State<signUp> {
  late bool isLoading;

  TextEditingController _emailController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();
  TextEditingController _firstNameController = TextEditingController();
  TextEditingController _lastNameController = TextEditingController();
  TextEditingController _repasswordController = TextEditingController();

  register(
      String firstName, String lastName, String email, String password) async {
    String url = "https://fypapp123.herokuapp.com/api/user";
    SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
    Map body = {
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "password": password
    };
    // ignore: prefer_typing_uninitialized_variables
    var jsonResponse;
    var res = await http.post(Uri.parse(url), body: body);

    // Api status
    if (res.statusCode == 200) {
      jsonResponse = json.decode(res.body);

      if (jsonResponse != null) {
        setState(() {
          isLoading = false;
        });
        sharedPreferences.setString("token", jsonResponse['token']);
        token = jsonResponse['token'];

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
      appBar: AppBar(
        elevation: 0.0,
        backgroundColor: Theme.of(context).primaryColor,
        leading: GestureDetector(
          onTap: () {
            Navigator.pop(context);
          },
          child: const Icon(
            Icons.arrow_back_ios_new,
            color: Colors.white,
          ),
        ),
      ),
      resizeToAvoidBottomInset: false,
      body: Container(
        decoration: BoxDecoration(color: Theme.of(context).primaryColor),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const SizedBox(
                height: 10,
              ),
              Padding(
                padding: const EdgeInsets.all(0.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const Text(
                      'Sign Up',
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
                      child: Column(children: <Widget>[
                        const SizedBox(height: 40),
                        Container(
                          margin: const EdgeInsets.all(20.0),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(30),
                            boxShadow: [
                              BoxShadow(
                                  color: Theme.of(context).primaryColor,
                                  blurRadius: 20,
                                  offset: const Offset(0, 10))
                            ],
                          ),
                          child: Column(
                            children: <Widget>[
                              Container(
                                padding: const EdgeInsets.all(10.0),
                                decoration: const BoxDecoration(
                                    border: Border(
                                  bottom: BorderSide(color: (Colors.grey)),
                                )),
                                child: TextFormField(
                                  controller: _firstNameController,
                                  decoration: const InputDecoration(
                                      hintText: "First Name",
                                      hintStyle: TextStyle(
                                        color: Color(0xff107163),
                                      ),
                                      border: InputBorder.none),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.all(10.0),
                                decoration: const BoxDecoration(
                                    border: Border(
                                  bottom: BorderSide(color: (Colors.grey)),
                                )),
                                child: TextFormField(
                                  controller: _lastNameController,
                                  decoration: const InputDecoration(
                                      hintText: "Last Name",
                                      hintStyle: TextStyle(
                                        color: Color(0xff107163),
                                      ),
                                      border: InputBorder.none),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.all(10.0),
                                decoration: const BoxDecoration(
                                    border: Border(
                                  bottom: BorderSide(color: (Colors.grey)),
                                )),
                                child: TextFormField(
                                  controller: _emailController,
                                  decoration: const InputDecoration(
                                      hintText: "Email",
                                      hintStyle: TextStyle(
                                        color: Color(0xff107163),
                                      ),
                                      border: InputBorder.none),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.all(10.0),
                                decoration: const BoxDecoration(
                                    border: Border(
                                  bottom: BorderSide(color: (Colors.grey)),
                                )),
                                child: TextFormField(
                                  controller: _passwordController,
                                  decoration: const InputDecoration(
                                      hintText: "Password",
                                      hintStyle: TextStyle(
                                        color: Color(0xff107163),
                                      ),
                                      border: InputBorder.none),
                                  obscureText: true,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.all(10.0),
                                decoration: const BoxDecoration(
                                    border: Border(
                                  bottom: BorderSide(color: (Colors.grey)),
                                )),
                                child: TextFormField(
                                  controller: _repasswordController,
                                  decoration: const InputDecoration(
                                      hintText: "Re-Enter Password",
                                      hintStyle: TextStyle(
                                        color: Color(0xff107163),
                                      ),
                                      border: InputBorder.none),
                                  obscureText: true,
                                ),
                              ),
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
                                borderRadius:
                                    BorderRadius.all(Radius.circular(10))),
                            onPressed: () {
                              if (_firstNameController.text == "" ||
                                  _lastNameController.text == "" ||
                                  _emailController.text == '' ||
                                  _passwordController.text == '') {
                                Get.snackbar('Error', 'Empty Fields',
                                    snackPosition: SnackPosition.BOTTOM);
                              } else {
                                if (_passwordController.text ==
                                    _repasswordController.text) {
                                  setState(() {
                                    isLoading = true;
                                  });
                                  register(
                                      _firstNameController.text,
                                      _lastNameController.text,
                                      _emailController.text,
                                      _passwordController.text);
                                } else {
                                  Get.snackbar('Error',
                                      'The two passwords does not match',
                                      snackPosition: SnackPosition.BOTTOM);
                                }
                              }
                            },
                            color: Colors.redAccent,
                            child: const Text(
                              'Sign Up',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18),
                            ),
                          ),
                        ),
                      ]),
                    ),
                  ),
                ),
              ),
            ]),
      ),
    );
  }
}
