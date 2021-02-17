from django.forms import ModelForm, Form
import django.forms as f
from django.forms.fields import Field
from .models import Subject, News
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from bson import ObjectId


class CustomModelChoiceField(f.ModelChoiceField):
    def to_python(self, value):
        if value in self.empty_values:
            return None
        try:
            key = self.to_field_name or 'pk'
            if isinstance(value, self.queryset.model):
                value = getattr(value, key)
            
            if key == 'pk':
                value = self.queryset.get(**{key: ObjectId(value)})
            else:
                value = self.queryset.get(**{key: value})
        except (ValueError, TypeError, self.queryset.model.DoesNotExist):
            raise ValidationError(
                self.error_messages['invalid_choice'],
                code='invalid_choice',
                params={'value': value},
            )
        return value


class RegisterForm(UserCreationForm):
    first_name = f.CharField(max_length=30)
    last_name = f.CharField(max_length=30)
    email = f.EmailField(
        max_length=128, help_text='Required. Inform a valid email address.')
    birth_date = f.DateField(
        required=False, help_text='Optional. Format: YYYY-MM-DD')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email',
                  'password1', 'password2', 'birth_date')


class SubjectForm(ModelForm):
    class Meta:
        model = Subject
        fields = ['name', 'description']


class NewsForm(ModelForm):
    subject = CustomModelChoiceField(queryset=Subject.objects.all())

    class Meta:
        model = News
        fields = ['title', 'content', 'subject']
