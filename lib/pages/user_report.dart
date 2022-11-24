import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:fyp/globals.dart';

class UserReport extends StatefulWidget {
  const UserReport({Key? key}) : super(key: key);

  @override
  State<UserReport> createState() => _UserReportState();
}

class _UserReportState extends State<UserReport> {
  String url = "https://fypapp123.herokuapp.com/api/user/image/report/";
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
              height: 100,
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
                        child: const Text(
                          'User Report',
                          style: TextStyle(
                              fontSize: 22,
                              color: Colors.white,
                              fontWeight: FontWeight.w700),
                        ),
                      ),
                      Center(
                          child: Container(
                        padding: const EdgeInsets.all(5),
                        margin: const EdgeInsets.only(bottom: 10),
                        child: const Text(
                          'All your previous reports are shown here',
                          style: TextStyle(color: Colors.white),
                        ),
                      )),
                    ]),
              )),
          Container(
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
              child: ListView.builder(
                itemCount: userReports.length,
                scrollDirection: Axis.vertical,
                shrinkWrap: true,
                itemBuilder: (context, int index) {
                  return Container(
                      child: Image.network(url + userReports[index]));
                },
              )),
        ])));
  }
}
