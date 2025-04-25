from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from .models import Tender

def tender_list(request):
    current_tenders = Tender.objects.filter(
        status='open',
        closing_date__gt=timezone.now()
    )
    past_tenders = Tender.objects.exclude(
        status='open',
        closing_date__gt=timezone.now()
    )
    
    return render(request, 'tenders/tender_list.html', {
        'current_tenders': current_tenders,
        'past_tenders': past_tenders
    })

def tender_detail(request, pk):
    tender = get_object_or_404(Tender, pk=pk)
    return render(request, 'tenders/tender_detail.html', {'tender': tender})
