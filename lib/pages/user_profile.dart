import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:fyp/globals.dart';

import 'package:get/get.dart';
import 'package:http/http.dart' as http;

class UserProfile extends StatefulWidget {
  const UserProfile({Key? key}) : super(key: key);

  @override
  State<UserProfile> createState() => _UserProfileState();
}

class _UserProfileState extends State<UserProfile> {
  TextEditingController _phoneController = TextEditingController();
  TextEditingController _ageController = TextEditingController();
  TextEditingController _genderController = TextEditingController();
  TextEditingController _bloodTypeController = TextEditingController();

  addUserInfo() async {
    String url = "https://fypapp123.herokuapp.com/api/user";

    Map body = {
      "bloodGroup": _bloodTypeController.text,
      "contactNo": _phoneController.text,
      "gender": _genderController.text,
      "age": _ageController.text
    };

    var res = await http.put(Uri.parse(url),
        headers: <String, String>{'x-auth-token': token}, body: body);

    Get.snackbar('Success', 'User Info Updated',
        snackPosition: SnackPosition.BOTTOM);
  }

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
        body: SingleChildScrollView(
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              height: 200,
              decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(30),
                      bottomRight: Radius.circular(30))),
              child: ListView(children: [
                Container(
                    child: Column(
                  children: [
                    Container(
                      margin: const EdgeInsets.only(left: 5, bottom: 10),
                      child: const Text(
                        'User Profile',
                        style: TextStyle(fontSize: 25, color: Colors.white),
                      ),
                    ),
                    Container(
                      child: const CircleAvatar(
                        radius: 50,
                        backgroundImage: AssetImage('assets/user.png'),
                        backgroundColor: Colors.white,
                      ),
                    )
                  ],
                )),
              ]),
            ),
            Container(
              height: 400,
              margin: const EdgeInsets.only(left: 5),
              child: GestureDetector(
                onTap: () {
                  FocusScope.of(context).unfocus();
                },
                child: ListView(
                  padding: const EdgeInsets.all(10),
                  children: [
                    TextField(
                      enabled: false,
                      decoration: InputDecoration(
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          labelText: "Full Name",
                          hintText: (firstName + '' + lastName),
                          hintStyle: const TextStyle(
                              color: Colors.black, fontSize: 15)),
                    ),
                    TextField(
                      enabled: false,
                      decoration: InputDecoration(
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          labelText: "E-mail",
                          hintText: email,
                          hintStyle:
                              TextStyle(color: Colors.black, fontSize: 15)),
                    ),
                    TextField(
                      controller: _phoneController,
                      decoration: InputDecoration(
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          labelText: "Phone Number",
                          hintText: phone,
                          hintStyle: const TextStyle(
                              color: Colors.black, fontSize: 15)),
                    ),
                    TextField(
                      controller: _genderController,
                      decoration: InputDecoration(
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          labelText: "Gender",
                          hintText: gender,
                          hintStyle:
                              TextStyle(color: Colors.black, fontSize: 15)),
                    ),
                    TextField(
                      controller: _ageController,
                      decoration: InputDecoration(
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          labelText: "Age",
                          hintText: age,
                          hintStyle: const TextStyle(
                              color: Colors.black, fontSize: 15)),
                    ),
                    TextField(
                      controller: _bloodTypeController,
                      decoration: InputDecoration(
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          labelText: "Blood Group",
                          hintText: bloodGroup,
                          hintStyle: const TextStyle(
                              color: Colors.black, fontSize: 15)),
                    ),
                  ],
                ),
              ),
            ),
            Container(
              alignment: Alignment.center,
              child: MaterialButton(
                  shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(Radius.circular(10))),
                  color: Colors.red[700],
                  child: const Text(
                    'Submit',
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18),
                  ),
                  onPressed: () {
                    if (_ageController.text.isEmpty ||
                        _phoneController.text.isEmpty ||
                        _genderController.text.isEmpty ||
                        _bloodTypeController.text.isEmpty) {
                      Get.snackbar('Error', 'Empty Fields',
                          snackPosition: SnackPosition.BOTTOM);
                    } else {
                      if (age.isEmpty ||
                          gender.isEmpty ||
                          phone.isEmpty ||
                          bloodGroup.isEmpty) {
                        addUserInfo();
                      } else {}
                    }
                  }),
            )
          ]),
        ));
  }

// bottom sheet for uploading picture

}
