from django import forms
from allauth.account.forms import SignupForm
from django.utils.translation import gettext_lazy as _

class CustomSignupForm(SignupForm):
    phone_number = forms.CharField(
        max_length=15,
        label=_("Phone Number"),
        required=True,
        widget=forms.TextInput(
            attrs={
                'placeholder': _('Phone Number'),
                'autocomplete': 'tel'
            }
        )
    )

    def save(self, request):
        # Save the original fields
        user = super(CustomSignupForm, self).save(request)
        
        # Save the phone number to the user's profile
        user.phone_number = self.cleaned_data['phone_number']
        user.save()
        
        return user
