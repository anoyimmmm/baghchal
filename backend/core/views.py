from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

@api_view(['GET'])
def index(request):
    return Response({"message": "hello world"})

@api_view(['POST'])
def signup(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    display_name = data.get('displayName', username)
    # avatar = request.data.get("avatar") # save later on 

    if not (username and  password and email):
        print('incomplete data')
        return Response({'error': 'incomplete data'}, status=400)
    
    if User.objects.filter(username=username).exists():
        print("username already taken")
        return Response({'error': 'username already taken'}, status=400)
    if User.objects.filter(email=email).exists():
        print('email already registered')
        return Response({'error': 'email already registered'}, status=400)

    user = User(username=username , email=email, first_name=display_name)
    user.set_password(password)

    if not user:
        print("unable to signup")
        return Response({'error': 'unable to signup'}, status=400)
    user.save()
    # handle avatar upload here 
    
    serializer = UserSerializer(user)
    print("successfully signup")
    return Response({"message": "signup successful"}, status=201)
    # return Response({'user_data': serializer.data}, status=201)



@api_view(['POST'])
def login(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')

    if not (username and password):
        return Response({'error': "usenrame and password required"}, status=400)
    
    user = authenticate(username=username, password=password)
    if user is None:
        print('no user')
        return Response({"error": "user doesn't exist"}, status=400)
    
    
    serializer = UserSerializer(user)
    print("_------------successfully logged in------------")
    print(serializer.data)
    return Response({'user_data': serializer.data}, status=200)