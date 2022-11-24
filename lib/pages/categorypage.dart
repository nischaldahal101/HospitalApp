import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fyp/pages/diseases.dart';
import 'package:http/http.dart' as http;
import 'package:fyp/globals.dart';

class CategoryPage extends StatefulWidget {
  String name;
  String details;
  var availabledoctors;
  var possibleDisease;
  String image;

  CategoryPage({
    required this.name,
    required this.image,
    required this.details,
    required this.availabledoctors,
    required this.possibleDisease,
  });

  @override
  State<CategoryPage> createState() => _CategoryPageState();
}

class _CategoryPageState extends State<CategoryPage> {
  Future getcurrentUser() async {
    String url = "https://fypapp123.herokuapp.com/api/category/checkups";

    var res = await http
        .get(Uri.parse(url), headers: <String, String>{'x-auth-token': token});

    // Api status
    if (res.statusCode == 200) {
      var jsonResponse = json.decode(res.body);
      setState(() {
        firstName = jsonResponse['firstName'];
        lastName = jsonResponse['lastName'];
        userReports = jsonResponse['userReports'];
        email = jsonResponse['email'];
        UserId = jsonResponse['_id'];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
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
              height: 300,
              decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor,
                  borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(30),
                      bottomRight: Radius.circular(30))),
              child: Container(
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.only(top: 5, bottom: 10),
                        alignment: Alignment.center,
                        margin: const EdgeInsets.only(bottom: 10),
                        child: Text(
                          widget.name,
                          style: const TextStyle(
                              fontSize: 22,
                              color: Colors.white,
                              fontWeight: FontWeight.w700),
                        ),
                      ),
                      Center(
                        child: Container(
                            alignment: Alignment.center,
                            height: 100,
                            width: 150,
                            margin: const EdgeInsets.only(bottom: 10),
                            child: Image.network(widget.image)),
                      ),
                      Center(
                          child: Container(
                        padding: const EdgeInsets.all(5),
                        margin: const EdgeInsets.only(bottom: 10),
                        child: Text(
                          widget.details,
                          style: TextStyle(color: Colors.white),
                        ),
                      )),
                    ]),
              )),
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 20, bottom: 10),
              child: const Text(
                'Available Doctors',
                style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.bold,
                    fontSize: 20),
              ),
            ),
          ),
          Container(
              margin: const EdgeInsets.all(5),
              child: ListView.builder(
                itemCount: widget.availabledoctors.length,
                scrollDirection: Axis.vertical,
                shrinkWrap: true,
                itemBuilder: (context, int index) {
                  return Card(
                    child: ListTile(
                      title: Text(widget.availabledoctors[index]['doctorName']),
                    ),
                  );
                },
              )),
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 20, bottom: 10),
              child: const Text(
                'Possible Diseases',
                style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.bold,
                    fontSize: 20),
              ),
            ),
          ),
          Container(
              margin: const EdgeInsets.all(5),
              child: ListView.builder(
                itemCount: widget.possibleDisease.length,
                scrollDirection: Axis.vertical,
                shrinkWrap: true,
                itemBuilder: (context, int index) {
                  return Card(
                    child: ListTile(
                      title: Text(widget.possibleDisease[index]['diseaseName']),
                      trailing: InkWell(
                        child: Text(
                          'View',
                          style: TextStyle(
                              color: Theme.of(context).secondaryHeaderColor,
                              fontSize: 12),
                        ),
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => Diseases(
                                      name: widget.possibleDisease[index]
                                          ['diseaseName'],
                                      details: widget.possibleDisease[index]
                                          ['diseaseDesc'])));
                        },
                      ),
                    ),
                  );
                },
              ))
        ])));
  }
}
