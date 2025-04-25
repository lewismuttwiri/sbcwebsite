from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView
from .models import Comment
from .forms import CommentForm


class ContactView(CreateView):
    model = Comment
    form_class = CommentForm
    template_name = 'contact/contact.html'
    success_url = reverse_lazy('home')
