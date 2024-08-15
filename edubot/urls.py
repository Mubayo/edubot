# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from django.contrib.auth.models import User
# from .models import Message
# from .serializers import UserSerializer, MessageSerializer
# from rest_framework.permissions import IsAuthenticated

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated]

# class MessageViewSet(viewsets.ModelViewSet):
#     queryset = Message.objects.all()
#     serializer_class = MessageSerializer

#     def perform_create(self, serializer):
#         serializer.save(sender=self.request.user)

from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import UserViewSet, MessageViewSet
from .views import MyTokenObtainPairView, MyTokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]