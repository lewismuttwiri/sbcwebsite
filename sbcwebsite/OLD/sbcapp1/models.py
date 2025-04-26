from django.db import models
from django.utils import timezone
from datetime import datetime
from datetime import date
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
CustomUser = get_user_model()
# NB: Product master  are created in the backend by the admin.
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='images/', blank=False, null=False)
    status = models.CharField(max_length=20, choices=[('Available', 'available'), ('Coming soon', 'coming_Soon')], default='Available')
    def __str__(self):
        return self.name

class CartItem(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.quantity} x {self.product.name}'

# NB: special url and email to access orders placed. url=orders_placed. email=mt.orders@sbckenya.com
class Order(models.Model):
    REGION_CHOICES = [
        ('Nairobi', 'Nairobi'),
        ('Coast', 'Coast'),
        ('Western', 'Western'),
        ('Mt Kenya', 'Mt Kenya'),
        ('Southern', 'Southern'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    product_name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100,default='name')
    phone_number = models.CharField(max_length=20,default='phone_number')
    region = models.CharField(max_length=100, choices=REGION_CHOICES,default='region')

    def __str__(self):
        user_info = f'{self.user.username} ({self.user.email})'
        return f'{user_info} - {self.quantity} x {self.product_name}'

    class Meta:
        ordering = ['-created_at']

# NB: The advertisement are posted from the back end.special url and email to jobs appleid. hro@sbckenya.com url=job_applied

class JobAdvertisement(models.Model):
    title = models.CharField(max_length=100)
    positions_available = models.PositiveIntegerField(default=1)
    date_posted = models.DateField(default=datetime.now)
    deadline_date = models.DateField(default=timezone.now)
    key_responsibilities = models.TextField()
    qualifications = models.TextField()
    def __str__(self):
        return f"{self.title} ({self.positions_available})"

def validate_file_size(value):
    limit = 2 * 1024 * 1024
    if value.size > limit:
        raise ValidationError('File size cannot exceed 2MB.')

class JobApplication(models.Model):
    advertisement = models.ForeignKey(JobAdvertisement, on_delete=models.CASCADE)
    full_names = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    current_address = models.CharField(max_length=255)
    date_of_birth = models.DateField(default=date.today)
    gender = models.CharField(max_length=1, choices=[
        ('M', 'Male'),
        ('F', 'Female'),
        ('N', 'Rather not say')
    ])
    education_level = models.CharField(max_length=20, choices=[
        ('PhD', 'PhD'),
        ('Masters', 'Masters'),
        ('Degree', 'Degree'),
        ('Diploma', 'Diploma'),
        ('Certificate', 'Certificate')
    ] ,default='Degree')
    institution_name = models.CharField(max_length=100,default='')
    course_of_study = models.CharField(max_length=100,default='')
    education_start_date = models.DateField(default=date.today)
    education_end_date = models.DateField(default=date.today)
    qualification_grade = models.CharField(max_length=50,default='')
    professional_institution_name = models.CharField(max_length=100,default='')
    course_name = models.CharField(max_length=100,default='')
    professional_start_date = models.DateField(default=date.today)
    professional_end_date = models.DateField(default=date.today)
    professional_qualification_grade = models.CharField(max_length=50 ,default='')
    previous_employer_name = models.CharField(max_length=100,default='')
    previous_employer_address = models.CharField(max_length=255,default='')
    previous_employer_phone = models.CharField(max_length=15,default='')
    job_title = models.CharField(max_length=100,default='')
    employment_start_date = models.DateField(default=date.today)
    employment_end_date = models.DateField(default=date.today)
    employment_duties = models.TextField(default='',max_length=400)
    cover_letter = models.TextField(max_length=400)
    resume = models.FileField(
        upload_to='resumes/',
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf']),
            validate_file_size
        ]
    )

    DECLARATION_STATEMENT = (
        "I hereby certify that to the best of my knowledge the details given in this form are correct. "
        "I understand that in the event of being offered employment with SBC KENYA LTD, any proven falsification "
        "or concealment of any material fact in respect of my application may lead to SBC KENYA LTD withdrawing the "
        "offer of employment if employment has not commenced or disciplinary action and dismissal if employment has "
        "commenced."
    )

    def __str__(self):
        return f"Advertisement: {self.advertisement.title}, Email: {self.email}, Full Names: {self.full_names}"


class Comment(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()

    def __str__(self):
        return f"{self.subject} - {self.email}"
# Added on backend, For related image select all to associate with main image
class Media(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='media_images/')
    description = models.TextField()
    datetime_posted = models.DateTimeField(default=timezone.now)
    related_images = models.ManyToManyField('RelatedImage', blank=True)

    def __str__(self):
        return self.title

class RelatedImage(models.Model):
    image = models.ImageField(upload_to='related_media_images/')
    caption = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.caption if self.caption else "Related Image"
# to be uploaded in the admin backend. UNIQUE constraint failed: sbcapp1_tender.tender_number means the same number so change
class Tender(models.Model):
    costcenter_choices = [
        ('ADMI', 'General Administration'),
        ('SM&P', 'Sales,Markerting and Promotion'),
        ('PR&A', 'Production and Asset Care'),
    ]
    costcenter = models.CharField(max_length=40, choices=costcenter_choices)
    number = models.PositiveIntegerField(default=1)
    date = models.DateField(default=datetime.now)
    tender_number = models.CharField(max_length=50, unique=True, editable=False)
    tender_description = models.TextField()
    tender_document = models.FileField(upload_to='tenders/')
    additional_information = models.FileField(upload_to='tenders/', blank=True, null=True)
    tender_closing_date = models.DateField()

    def save(self, *args, **kwargs):
        if not self.tender_number:
            self.tender_number = f"SBC-RFT/{self.costcenter}/{self.number:02}/{self.date.strftime('%d%m%y')}"
        super(Tender, self).save(*args, **kwargs)

    def __str__(self):
        return self.tender_number

