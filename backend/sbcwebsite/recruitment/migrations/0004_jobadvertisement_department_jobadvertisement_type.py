# Generated by Django 5.2.1 on 2025-06-04 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recruitment', '0003_alter_jobadvertisement_closing_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobadvertisement',
            name='department',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='jobadvertisement',
            name='type',
            field=models.CharField(choices=[('full_time', 'Full Time'), ('part_time', 'Part Time'), ('contract', 'Contract'), ('temporary', 'Temporary'), ('internship', 'Internship'), ('freelance', 'Freelance'), ('remote', 'Remote')], default='full_time', max_length=20),
        ),
    ]
