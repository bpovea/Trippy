# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-06 22:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_auto_20171206_2149'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='codigo',
            field=models.TextField(blank=True, max_length=7),
        ),
    ]
