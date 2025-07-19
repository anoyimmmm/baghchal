from django.shortcuts import render, HttpResponse
# Create your views here.
def index(request):
    print("hello world")
    return HttpResponse("<h1> hello, world <h1/>")