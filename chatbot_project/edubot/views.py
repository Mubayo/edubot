from django.shortcuts import render

# Create your views here.
from openai import OpenAI
# import openai
from transformers import T5ForConditionalGeneration, T5Tokenizer
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Message
from django.http import JsonResponse
from .serializers import UserSerializer, MessageSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

client = OpenAI(api_key=settings.OPENAI_API_KEY)
tokenizer = T5Tokenizer.from_pretrained('t5-base')
model = T5ForConditionalGeneration.from_pretrained('t5-base')
# client = openai.OpenAI()
# api_key = settings.OPENAI_API_KEY)
class MyTokenObtainPairView(TokenObtainPairView):
    # pass
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Add CORS headers
        response['Access-Control-Allow-Origin'] = 'http://localhost:5500'
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept'
        
        return response

class MyTokenRefreshView(TokenRefreshView):
    # pass
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Add CORS headers
        response['Access-Control-Allow-Origin'] = 'http://localhost:5500'
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept'
        
        return response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    # permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        content = request.data.get('content')
        # response = super().post(request, *args, **kwargs)
        
        # # Add CORS headers
        # response['Access-Control-Allow-Origin'] = 'http://localhost:5500'
        # response['Access-Control-Allow-Credentials'] = 'true'
        # response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        # response['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept'
        
        # Get the bot response
        bot_response = self.get_bot_response(content+"make it in uk education standard education")
        response2 =self.paraphrase(bot_response)
        # Save the user message
        # message = Message.objects.create(sender=user, content=content, response = bot_response)
        message = Message.objects.create(sender=user, content=content, response = response2)

        # Save the bot response
        # bot_message = Message.objects.create(sender=user, content=bot_response)

        # Serialize the messages
        user_message_serializer = MessageSerializer(message)
        # bot_message_serializer = MessageSerializer(bot_message)

        return Response({
            'message': user_message_serializer.data,
            # user_message_serializer.data,
            # 'bot_response': bot_message_serializer.data
        }, status=status.HTTP_201_CREATED)
        # return response

    # def perform_create(self, serializer):
    #     message = serializer.save(sender=self.request.user)
    #     response = self.get_bot_response(message.content)
    #     humanized_response = self.humanize_response(response)
    #     message.response = humanized_response
    #     message.save()
    #     # Serialize the messages
    #     user_message_serializer = MessageSerializer(message)
    #     bot_message_serializer = MessageSerializer(humanized_response)
    #     return Response({
    #         'user_message': user_message_serializer.data,
    #         'bot_response': bot_message_serializer.data
    #     }, status=status.HTTP_201_CREATED)

    def get_bot_response(self, message_content):
        response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": message_content
        }
      ]
    }, 
    ],
  temperature=1,
#   max_tokens=256,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0
)
        return response.choices[0].message.content.strip()

    def humanize_response(self, raw_response):
        sentences = raw_response.split('.')
        humanized = '. '.join(sentence.capitalize() for sentence in sentences)
        return humanized
    
    def paraphrase(self,text):
        input_text = f"paraphrase: {text}"
        input_ids = tokenizer.encode(input_text, return_tensors='pt')
        outputs = model.generate(input_ids, num_beams=4,max_new_tokens = 750, early_stopping=True)
        return tokenizer.decode(outputs[0], skip_special_tokens=True)
    # def get_bot_response(self, user_message):
    #     response = client.chat.completions.create(
    #         # engine="davinci-codex",
    #     prompt=user_message,
    #     # tools=[{"type": "code_interpreter"}],
    #     model="gpt-4o",
    #     # max_tokens=150
    #     )
    #     return response.choices[0].text.strip()

    # def perform_create(self, serializer):
    #     serializer.save(sender=self.request.user)
