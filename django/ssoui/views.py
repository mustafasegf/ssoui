from django.shortcuts import render
from django.http import HttpResponse
from urllib import parse as urllib_parse
import urllib3
import xmltodict
from .models import Profile, User, save_user_attributes
from rest_framework_jwt.settings import api_settings

# Create your views here.
JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER

def index(request):
    return render(request, "ssoui/index.html")
    # return HttpResponse("Hello, world. You're at the polls index.")

def login(request):
    originURL = "http://localhost:8000/"
    serverURL = "http://localhost:8000/login/"

    http = urllib3.PoolManager()

    response = http.request('GET', f"https://sso.ui.ac.id/cas2/serviceValidate?ticket={request.GET.get('ticket', '')}&service={serverURL}")
    rawdata = response.data.decode('utf-8')
    data = xmltodict.parse(rawdata)
    data = data.get('cas:serviceResponse', {}).get('cas:authenticationSuccess',{})
    
    user = None
    profileData = None
    try:
        user = User.objects.get(email=f'{data.get("cas:user", "")}@ui.ac.id')
    except User.DoesNotExist:
        if data.get("cas:user"):
            username =  data.get("cas:user")

            data = data.get("cas:attributes")
            userData = {'username': username, 'email': f'{username}@ui.ac.id' }
            profileData = {'email': f'{username}@ui.ac.id', 'kd_org':data.get('cas:kd_org'),'nama':data.get('cas:nama'), 'npm':data.get('cas:npm'), 'peran_user': data.get('cas:peran_user'),  }
            user = User.objects.create(**userData)
            profile = Profile.objects.get(user=user)
            save_user_attributes(user, profileData)

    payload = JWT_PAYLOAD_HANDLER(user)
    jwtToken = JWT_ENCODE_HANDLER(payload)

    
    context = { 'LoginResponse' : f'{{"token":"{jwtToken}","nama":"{user.get_full_name()}" }}', 'OriginUrl':originURL}
    response = render(request, "ssoui/popup.html", context)
    response['Cross-Origin-Opener-Policy'] = 'unsafe-none'
    return response
