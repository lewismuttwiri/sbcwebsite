# Generated by Django 5.0.6 on 2024-10-02 07:12

import datetime
import django.core.validators
import django.db.models.deletion
import django.utils.timezone
import sbcapp1.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Comment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("email", models.EmailField(max_length=254)),
                ("subject", models.CharField(max_length=200)),
                ("message", models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name="JobAdvertisement",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=100)),
                ("positions_available", models.PositiveIntegerField(default=1)),
                ("key_responsibilities", models.TextField()),
                ("qualifications", models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField()),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("image", models.ImageField(upload_to="images/")),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("Available", "available"),
                            ("Coming soon", "coming_Soon"),
                        ],
                        default="Available",
                        max_length=20,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="RelatedImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image", models.ImageField(upload_to="related_media_images/")),
                ("caption", models.CharField(blank=True, max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="Tender",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "costcenter",
                    models.CharField(
                        choices=[
                            ("ADMI", "General Administration"),
                            ("SM&P", "Sales,Markerting and Promotion"),
                            ("PR&A", "Production and Asset Care"),
                        ],
                        max_length=40,
                    ),
                ),
                ("number", models.PositiveIntegerField(default=1)),
                ("date", models.DateField(default=datetime.datetime.now)),
                (
                    "tender_number",
                    models.CharField(editable=False, max_length=50, unique=True),
                ),
                ("tender_description", models.TextField()),
                ("tender_document", models.FileField(upload_to="tenders/")),
                (
                    "additional_information",
                    models.FileField(blank=True, null=True, upload_to="tenders/"),
                ),
                ("tender_closing_date", models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name="JobApplication",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("full_names", models.CharField(max_length=100)),
                ("email", models.EmailField(max_length=254)),
                ("phone_number", models.CharField(max_length=15)),
                ("current_address", models.CharField(max_length=255)),
                ("date_of_birth", models.DateField(default=datetime.date.today)),
                (
                    "gender",
                    models.CharField(
                        choices=[
                            ("M", "Male"),
                            ("F", "Female"),
                            ("N", "Rather not say"),
                        ],
                        max_length=1,
                    ),
                ),
                (
                    "education_level",
                    models.CharField(
                        choices=[
                            ("PhD", "PhD"),
                            ("Masters", "Masters"),
                            ("Degree", "Degree"),
                            ("Diploma", "Diploma"),
                            ("Certificate", "Certificate"),
                        ],
                        default="Degree",
                        max_length=20,
                    ),
                ),
                ("institution_name", models.CharField(default="", max_length=100)),
                ("course_of_study", models.CharField(default="", max_length=100)),
                ("education_start_date", models.DateField(default=datetime.date.today)),
                ("education_end_date", models.DateField(default=datetime.date.today)),
                ("qualification_grade", models.CharField(default="", max_length=50)),
                (
                    "professional_institution_name",
                    models.CharField(default="", max_length=100),
                ),
                ("course_name", models.CharField(default="", max_length=100)),
                (
                    "professional_start_date",
                    models.DateField(default=datetime.date.today),
                ),
                (
                    "professional_end_date",
                    models.DateField(default=datetime.date.today),
                ),
                (
                    "professional_qualification_grade",
                    models.CharField(default="", max_length=50),
                ),
                (
                    "previous_employer_name",
                    models.CharField(default="", max_length=100),
                ),
                (
                    "previous_employer_address",
                    models.CharField(default="", max_length=255),
                ),
                (
                    "previous_employer_phone",
                    models.CharField(default="", max_length=15),
                ),
                ("job_title", models.CharField(default="", max_length=100)),
                (
                    "employment_start_date",
                    models.DateField(default=datetime.date.today),
                ),
                ("employment_end_date", models.DateField(default=datetime.date.today)),
                ("employment_duties", models.TextField(default="", max_length=400)),
                ("cover_letter", models.TextField(max_length=400)),
                (
                    "resume",
                    models.FileField(
                        upload_to="resumes/",
                        validators=[
                            django.core.validators.FileExtensionValidator(
                                allowed_extensions=["pdf"]
                            ),
                            sbcapp1.models.validate_file_size,
                        ],
                    ),
                ),
                (
                    "advertisement",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="sbcapp1.jobadvertisement",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("product_name", models.CharField(max_length=100)),
                ("quantity", models.IntegerField(default=1)),
                (
                    "total_price",
                    models.DecimalField(decimal_places=2, default=0, max_digits=10),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("name", models.CharField(default="name", max_length=100)),
                (
                    "phone_number",
                    models.CharField(default="phone_number", max_length=20),
                ),
                (
                    "region",
                    models.CharField(
                        choices=[
                            ("Nairobi", "Nairobi"),
                            ("Coast", "Coast"),
                            ("Western", "Western"),
                            ("Mt Kenya", "Mt Kenya"),
                            ("Southern", "Southern"),
                        ],
                        default="region",
                        max_length=100,
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="CartItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("quantity", models.IntegerField(default=1)),
                (
                    "total_price",
                    models.DecimalField(decimal_places=2, default=0, max_digits=10),
                ),
                ("date_added", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="sbcapp1.product",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Media",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=100)),
                ("image", models.ImageField(upload_to="media_images/")),
                ("description", models.TextField()),
                (
                    "datetime_posted",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
                (
                    "related_images",
                    models.ManyToManyField(blank=True, to="sbcapp1.relatedimage"),
                ),
            ],
        ),
    ]
