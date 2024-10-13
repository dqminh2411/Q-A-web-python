# userauth/templatetags/custom_filters.py

from django import template

register = template.Library()

@register.filter
def endswith(value, suffix):
    return str(value).endswith(suffix)

@register.filter
def endswith_any(value, suffixes):
    return any(str(value).endswith(suffix.strip()) for suffix in suffixes.split(','))
