from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from .serializers import EmailLoginSerializer

class EmailLoginView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = EmailLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response({"detail": "Login successful."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
