import 'package:flutter/material.dart';

class Diseases extends StatefulWidget {
  String name;
  String details;

  Diseases({required this.name, required this.details});

  @override
  State<Diseases> createState() => _DiseasesState();
}

class _DiseasesState extends State<Diseases> {
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
                        padding: const EdgeInsets.only(top: 5, bottom: 8),
                        alignment: Alignment.center,
                        margin: const EdgeInsets.only(bottom: 10),
                        child: const Text(
                          'Diseases',
                          style: TextStyle(
                              fontSize: 30,
                              color: Colors.white,
                              fontWeight: FontWeight.w700),
                        ),
                      ),
                      Center(
                          child: Container(
                        padding: const EdgeInsets.all(5),
                        margin: const EdgeInsets.only(bottom: 10),
                        child: Text(
                          widget.name,
                          style: TextStyle(color: Colors.white, fontSize: 18),
                        ),
                      )),
                    ]),
              )),
          Container(
              padding: const EdgeInsets.all(20),
              child: Text(
                widget.details,
                style: TextStyle(
                    color: Theme.of(context).secondaryHeaderColor,
                    fontSize: 20),
              ))
        ])));
  }
}
