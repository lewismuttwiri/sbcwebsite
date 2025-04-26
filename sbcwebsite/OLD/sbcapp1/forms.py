from django import forms
from django.utils.translation import gettext_lazy as _
from .models import JobApplication,Comment,Order
from bootstrap_datepicker_plus.widgets import DatePickerInput

class JobApplicationForm(forms.ModelForm):
    declaration_agreement = forms.BooleanField(
        required=True,
        label=JobApplication.DECLARATION_STATEMENT,
        initial=False,
        widget=forms.HiddenInput()
    )

    class Meta:
        model = JobApplication
        fields = [
            'full_names', 'email', 'phone_number', 'current_address', 'date_of_birth', 'gender',
            'previous_employer_name', 'previous_employer_address', 'previous_employer_phone',
            'job_title', 'employment_start_date', 'employment_end_date', 'employment_duties',
            'education_level', 'institution_name', 'course_of_study', 'education_start_date',
            'education_end_date', 'qualification_grade', 'professional_institution_name', 'course_name',
             'professional_start_date', 'professional_end_date',
            'professional_qualification_grade', 'cover_letter', 'resume', 'declaration_agreement'
        ]

        widgets = {
            'full_names': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'email': forms.EmailInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'phone_number': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'current_address': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'date_of_birth': DatePickerInput(attrs={'class': 'w-1/3 px-2 py-2 text-xl border border-gray-300 rounded-md ml-4 date-picker-icon-lg'}),
            'gender': forms.Select(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'previous_employer_name': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'previous_employer_address': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'previous_employer_phone': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'job_title': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'employment_start_date': DatePickerInput(attrs={'class': 'w-1/3 px-2 py-2 text-xl border border-gray-300 rounded-md ml-4 date-picker-icon-lg'}),
            'employment_end_date': DatePickerInput(attrs={'class': 'w-1/3 px-2 py-2 text-xl border border-gray-300 rounded-md ml-4 date-picker-icon-lg'}),
            'employment_duties': forms.Textarea(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md', 'rows': 4}),
            'education_level': forms.Select(attrs={'class': 'block w-full px-4 py-3 text -3xl border border-gray-300 rounded-md'}),
            'institution_name': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'course_of_study': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'education_start_date': DatePickerInput(attrs={'class': 'w-1/3 px-2 py-2 text-xl border border-gray-300 rounded-md ml-4 date-picker-icon-lg'}),
            'education_end_date': DatePickerInput(attrs={'class': 'w-1/3 px-2 py-2 text-xl border border-gray-300 rounded-md ml-4 date-picker-icon-lg'}),
            'qualification_grade': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'professional_institution_name': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'course_name': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'professional_start_date': DatePickerInput(attrs={'class': 'w-1/3 px-2 py-2 text-xl border border-gray-300 rounded-md ml-4 date-picker-icon-lg'}),
            'professional_end_date': DatePickerInput(attrs={'class': 'w-1/3 px-2 py-2 text-xl border border-gray-300 rounded-md ml-4 date-picker-icon-lg'}),
            'professional_qualification_grade': forms.TextInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),
            'cover_letter': forms.Textarea(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md', 'rows': 4}),
            'resume': forms.FileInput(attrs={'class': 'block w-full px-4 py-3 text-3xl border border-gray-300 rounded-md'}),

        }

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        phone_number = cleaned_data.get('phone_number')
        if email:
            if JobApplication.objects.filter(email=email).exists():
                self.add_error('email', 'This email is already associated with an existing job application.')
        if phone_number:
            if JobApplication.objects.filter(phone_number=phone_number).exists():
                self.add_error('phone_number', 'This phone number is already associated with an existing job application.')
        declaration_agreement = cleaned_data.get('declaration_agreement')
        if not declaration_agreement:
            raise forms.ValidationError("You must agree to the declaration before submitting.")

        return cleaned_data


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control text-2xl p-4',  # Larger text and padding
                'placeholder': 'Your Name'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control text-2xl p-4',
                'placeholder': 'Your Email'
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control text-2xl p-4',
                'placeholder': 'Subject'
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control text-2xl p-4',
                'placeholder': 'Your Message',
                'rows': 4  # Optional: adjusts the height of the textarea
            }),
        }


