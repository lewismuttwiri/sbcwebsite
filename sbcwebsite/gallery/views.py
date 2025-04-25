from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Media

def media_list(request):
    media_items = Media.objects.all()
    return render(request, 'gallery/media_list.html', {'media_items': media_items})

def media_detail(request, pk):
    media_item = get_object_or_404(Media, pk=pk)
    related_media = Media.objects.exclude(pk=pk)
    related_images = media_item.related_images.all()
    return render(request, 'gallery/media_detail.html', {
        'media_item': media_item,
        'related_media': related_media,
        'related_images': related_images,
    })

def media_summary(request):
    media_items = Media.objects.order_by('-datetime_posted')[:2]
    data = [{
        'image': media_item.image.url,
        'title': media_item.title,
        'datetime_posted': media_item.datetime_posted.strftime('%Y-%m-%d %H:%M:%S'),
    } for media_item in media_items]
    return JsonResponse(data, safe=False)
