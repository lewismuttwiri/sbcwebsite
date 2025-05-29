from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .logger import app_logger

class ApiResponse:
    def __init__(self):
        self.status = 200
        self.message = ""
        self.entity = None
    
    def setStatusCode(self, status):
        self.status = status
    
    def setMessage(self, message):
        self.message = message
    
    def setEntity(self, entity):
        self.entity = entity
    
    def toDict(self):
        return {
            "status": self.status,
            "message": self.message,
            "entity": self.entity
        }


