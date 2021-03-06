# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-06 21:49
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0009_auto_20171202_0201'),
    ]

    operations = [
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Scheduler',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_start', models.TimeField(blank=True, null=True)),
                ('time_end', models.TimeField(blank=True, null=True)),
                ('lift_start', models.BooleanField(default=True)),
                ('lift_end', models.BooleanField(default=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='shift',
            name='lift_end',
        ),
        migrations.RemoveField(
            model_name='shift',
            name='lift_start',
        ),
        migrations.RemoveField(
            model_name='shift',
            name='time_end',
        ),
        migrations.RemoveField(
            model_name='shift',
            name='time_start',
        ),
        migrations.AlterField(
            model_name='triprequest',
            name='time_arrive',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='triprequest',
            name='time_pickup',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='area',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.Area'),
        ),
    ]
