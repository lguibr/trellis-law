# -*- coding: utf-8 -*-
from rest_framework import serializers


class NumberRequestSerializer(serializers.Serializer):
    number = serializers.CharField()

    def validate_number(
        self,
        value: str,
    ) -> float | serializers.ValidationError:
        try:
            _ = float(value)
            return value
        except ValueError:
            raise serializers.ValidationError(
                {"number": "Input must be a valid number."}
            )


class NumberResponseSerializer(serializers.Serializer):
    num_in_english = serializers.CharField()
