from rest_framework import generics, status
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.response import Response
from .utils import chat_bot


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user_message = request.data.get("input", "")
        if not user_message:
            return Response(
                {"error": "Message content is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get AI response
        response = chat_bot(input=user_message)

        return Response({"message": response}, status=status.HTTP_200_OK)
